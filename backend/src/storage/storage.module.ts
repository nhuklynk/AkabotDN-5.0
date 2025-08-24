import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import storageConfig from './storage.config';
import { AWS_S3_CLIENT, STORAGE_OPTIONS } from './constants';
import type { StorageOptions } from './types';

@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  controllers: [StorageController],
  providers: [
    {
      provide: AWS_S3_CLIENT,
      useFactory: (configService: ConfigService) => {
        const s3Config = configService.get('storage.s3');
        return new S3Client({
          region: s3Config.region,
          credentials: {
            accessKeyId: s3Config.accessKeyId,
            secretAccessKey: s3Config.secretAccessKey,
          },
          endpoint: s3Config.endpoint,
          forcePathStyle: s3Config.forcePathStyle,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: STORAGE_OPTIONS,
      useFactory: (configService: ConfigService): StorageOptions => ({
        maxSizeInMb: configService.get('storage.upload.maxSizeInMb', 10),
        defaultBucket: configService.get('storage.s3.defaultBucket', 'akabotdn'),
        allowedMimeTypes: configService.get('storage.upload.allowedMimeTypes', []),
      }),
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
