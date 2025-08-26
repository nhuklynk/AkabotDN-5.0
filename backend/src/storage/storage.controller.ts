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
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
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
    const url = await this.storageService.getFileUrl(arn);
    return { url };
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
      message: 'Upload policy generated successfully'
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
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|txt)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadOptions: UploadOptions,
  ) {
    const { bucket, scope } = uploadOptions;
    
    // Debug logging
    console.log('Upload request:', {
      originalFileName: file.originalname,
      bucket,
      scope
    });
    
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
      message: 'File uploaded successfully'
    };
  }

  @Post('download')
  @ApiOperation({ summary: 'Get download URL for file' })
  async getDownloadUrl(@Body() downloadUrlDto: DownloadUrlDto) {
    const expiresInSeconds = downloadUrlDto.expiresIn || 5 * 60;
    const downloadUrl = await this.storageService.getDownloadUrl(downloadUrlDto.arn, expiresInSeconds);
    
    return {
      success: true,
      data: {
        arn: downloadUrlDto.arn,
        downloadUrl,
        expiresInSeconds,
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString()
      },
      message: 'Download URL generated successfully'
    };
  }

  @Post('file')
  @ApiOperation({ summary: 'Download file by ARN' })
  async downloadFileByArn(@Body() downloadFileDto: DownloadFileDto) {
    const result = await this.storageService.downloadFileByArn(downloadFileDto.arn);
    
    return {
      success: true,
      data: {
        arn: downloadFileDto.arn,
        fileName: result.fileName,
        contentType: result.contentType,
        fileSize: result.fileContent.length,
        downloadUrl: `data:${result.contentType};base64,${result.fileContent.toString('base64')}`,
      },
      message: 'File downloaded successfully'
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
        deletedCount: results.filter(r => r.status === 'fulfilled').length,
        failedCount: results.filter(r => r.status === 'rejected').length,
      },
      message: `Deleted ${results.filter(r => r.status === 'fulfilled').length} files successfully`
    };
  }

  @Delete('file/:arn')
  @ApiOperation({ summary: 'Delete single file by ARN' })
  async deleteFile(@Param('arn') arn: string) {
    const results = await this.storageService.deleteFiles(arn);
    
    return {
      success: true,
      data: {
        arn,
        results,
        deleted: results[0]?.status === 'fulfilled',
      },
      message: results[0]?.status === 'fulfilled' ? 'File deleted successfully' : 'Failed to delete file'
    };
  }
}
