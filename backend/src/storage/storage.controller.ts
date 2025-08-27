import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import type { UploadOptions } from './types';
import { DownloadFileDto } from './dto/download-file.dto';
import { DownloadUrlDto } from './dto/download-url.dto';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('file-url')
  @ApiOperation({ summary: 'Get file URL by ARN' })
  async getFileUrl(@Query('arn') arn: string) {
    const result = await this.storageService.getFileUrl(arn);
    return { 
      success: true,
      data: result,
      message: 'File URL generated successfully'
    };
  }

  @Post('upload-policy')
  @ApiOperation({ summary: 'Get upload policy for direct S3 upload' })
  async getUploadPolicy(
    @Body() options: UploadOptions & { expiresInSeconds?: number },
  ) {
    const result = await this.storageService.getUploadPolicy(options);
    return {
      success: true,
      data: result,
      message: 'Upload policy generated successfully',
    };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload file directly to storage' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadOptions: UploadOptions,
  ) {
    const { bucket, scope } = uploadOptions;

    const arn = await this.storageService.uploadFile({
      file: file.buffer,
      bucket,
      scope,
      fileName: file.originalname,
      fileSize: file.size,
      contentType: file.mimetype,
    });

    return {
      success: true,
      data: {
        arn,
        bucket,
        scope,
        fileName: file.originalname,
        fileSize: file.size,
        contentType: file.mimetype,
      },
      message: 'File uploaded successfully',
    };
  }

  @Post('download')
  @ApiOperation({ summary: 'Get download URL for file with proper filename' })
  async getDownloadUrl(@Body() downloadUrlDto: DownloadUrlDto) {
    const expiresInSeconds = downloadUrlDto.expiresIn || 5 * 60;
    const result = await this.storageService.getDownloadUrlWithFilename(downloadUrlDto.arn, expiresInSeconds);
    
    return {
      success: true,
      data: result,
      message: 'Download URL generated successfully'
    };
  }

  @Get('download/:arn')
  @ApiOperation({ summary: 'Get download URL for file by ARN with proper filename' })
  async getDownloadUrlByArn(
    @Param('arn') arn: string, 
    @Query('expiresIn') expiresIn?: string
  ) {
    const expiresInSeconds = expiresIn ? parseInt(expiresIn, 10) : 5 * 60;
    const result = await this.storageService.getDownloadUrlWithFilename(arn, expiresInSeconds);
    
    return {
      success: true,
      data: result,
      message: 'Download URL generated successfully'
    };
  }

  @Post('file')
  @ApiOperation({ summary: 'Download file content by ARN' })
  async downloadFileByArn(@Body() downloadFileDto: DownloadFileDto) {
    const result = await this.storageService.downloadFileByArn(
      downloadFileDto.arn,
    );

    return {
      success: true,
      data: {
        arn: downloadFileDto.arn,
        fileName: result.fileName,
        contentType: result.contentType,
        fileSize: result.fileContent.length,
        downloadUrl: `data:${result.contentType};base64,${result.fileContent.toString('base64')}`,
      },
      message: 'File downloaded successfully',
    };
  }

  @Delete('files')
  @ApiOperation({ summary: 'Delete multiple files by ARNs' })
  async deleteFiles(@Body() body: { arns: string[] }) {
    const results = await this.storageService.deleteFiles(...body.arns);

    return {
      success: true,
      data: {
        arns: body.arns,
        results,
        deletedCount: results.filter((r) => r.status === 'fulfilled').length,
        failedCount: results.filter((r) => r.status === 'rejected').length,
      },
      message: `Deleted ${results.filter((r) => r.status === 'fulfilled').length} files successfully`,
    };
  }

  @Delete('file/delete')
  @ApiOperation({ summary: 'Delete single file by ARN' })
  async deleteFile(@Body() body: { arn: string }) {
    try {
      if (!body || !body.arn) {
        throw new BadRequestException('ARN is required in request body');
      }
      
      if (typeof body.arn !== 'string') {
        throw new BadRequestException(`ARN must be a string, got: ${typeof body.arn}`);
      }

      // Gọi service để xóa file và xử lý logic
      const result = await this.storageService.deleteSingleFile(body.arn);
      
      return {
        success: true,
        data: result,
        message: 'File deleted successfully' 
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(`Failed to delete file: ${error.message || 'Unknown error'}`);
    }
  }

  @Post('export-zip')
  @ApiOperation({ summary: 'Export multiple files as ZIP' })
  async exportFilesAsZip(@Body() body: { arns: string[], filename?: string }) {
    try {
      if (!body.arns || !Array.isArray(body.arns) || body.arns.length === 0) {
        throw new BadRequestException('ARNs array is required and must not be empty');
      }

      const zipBuffer = await this.storageService.exportFilesAsZip(body.arns, body.filename);
      const filename = body.filename || `export-${Date.now()}.zip`;
      
      return {
        success: true,
        data: {
          filename,
          fileSize: zipBuffer.length,
          downloadUrl: `data:application/zip;base64,${zipBuffer.toString('base64')}`,
          arns: body.arns
        },
        message: 'ZIP file generated successfully'
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(`Failed to generate ZIP: ${error.message || 'Unknown error'}`);
    }
  }
}
