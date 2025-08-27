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
        return new S3Client({
          region: configService.get('AWS_REGION', 'us-east-1'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID', 'test'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY', 'test'),
          },
          endpoint: configService.get('AWS_S3_ENDPOINT', 'http://localhost:9000'),
          forcePathStyle: configService.get('AWS_S3_FORCE_PATH_STYLE', 'true') === 'true',
        });
      },
      inject: [ConfigService],
    },
    {
      provide: STORAGE_OPTIONS,
      useFactory: (configService: ConfigService): StorageOptions => ({
        maxSizeInMb: configService.get('storage.maxSizeInMb', 10),
        defaultBucket: configService.get('storage.defaultBucket', 'akabotdn'),
        allowedMimeTypes: configService.get('storage.allowedMimeTypes', []),
      }),
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
