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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import type { UploadOptions } from './types';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-policy')
  @ApiOperation({ summary: 'Get upload policy for direct S3 upload' })
  async getUploadPolicy(
    @Body() options: UploadOptions & { expiresInSeconds?: number },
  ) {
    return this.storageService.getUploadPolicy(options);
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
    const { bucket, scope, fileName } = uploadOptions;
    
    return this.storageService.uploadFile({
      file: file.buffer,
      bucket,
      scope,
      fileName: fileName || file.originalname,
      fileSize: file.size,
      contentType: file.mimetype,
    });
  }

  @Get('download/:arn')
  @ApiOperation({ summary: 'Get download URL for file' })
  async getDownloadUrl(
    @Param('arn') arn: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    const expiresInSeconds = expiresIn ? parseInt(expiresIn, 10) : 5 * 60;
    return this.storageService.getDownloadUrl(arn, expiresInSeconds);
  }

  @Delete('files')
  @ApiOperation({ summary: 'Delete multiple files by ARNs' })
  async deleteFiles(@Body() body: { arns: string[] }) {
    return this.storageService.deleteFiles(...body.arns);
  }

  @Delete('file/:arn')
  @ApiOperation({ summary: 'Delete single file by ARN' })
  async deleteFile(@Param('arn') arn: string) {
    return this.storageService.deleteFiles(arn);
  }
}
