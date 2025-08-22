import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { AWS_S3_CLIENT, STORAGE_OPTIONS } from './constants';
import * as fs from 'fs';
import type { StorageOptions, UploadOptions } from './types';

// ARN: [service]:[bucket]:[objectName], e.g. s3:knowledge:example.txt
@Injectable()
export class StorageService {
  constructor(
    @Inject(AWS_S3_CLIENT)
    private readonly s3Client: S3Client,
    @Inject(STORAGE_OPTIONS)
    private readonly storageOptions: StorageOptions,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get a pre-signed URL for downloading the file with the given ARN
   * Example: s3:knowledge:example.txt
   */
  async getDownloadUrl(arn: string, expiresInSeconds = 5 * 60) {
    const { bucket, objectName } = this.extractArn(arn);

    const key = objectName;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: Math.max(expiresInSeconds, 10),
    });
  }

  private extractArn(arn: string) {
    const [service, bucket, objectName] = arn.split(':');

    if (service !== 's3') {
      throw new BadRequestException(`Invalid service ${service}`);
    }

    if (!objectName) {
      throw new BadRequestException(`Invalid object name ${objectName}`);
    }

    if (!bucket) {
      throw new BadRequestException(`Invalid bucket name ${bucket}`);
    }

    return {
      service,
      bucket,
      objectName,
    };
  }

  /**
   * Get a pre-signed policy for uploading a file to the specified bucket
   *
   * @returns A pre-signed policy and the object ARN that will be created
   */
  async getUploadPolicy(
    options: {
      expiresInSeconds?: number;
    } & UploadOptions,
  ) {
    const { bucket, fileName, scope, expiresInSeconds = 60 * 60 } = options;
    const objectName = scope ? `${scope}/${this.generateUuid()}` : this.generateUuid();

    const maxSizeInMb = this.storageOptions.maxSizeInMb;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    const metadata = {
      'x-amz-meta-file-name': fileName ?? '',
    };

    const postPolicy = await createPresignedPost(this.s3Client, {
      Bucket: bucket,
      Key: objectName,
      Conditions: [['content-length-range', 1, maxSizeInBytes]],
      Fields: {
        ...metadata,
      },
      Expires: expiresInSeconds,
    });

    return {
      policy: postPolicy,
      arn: `s3:${bucket}:${objectName}`,
    };
  }

  /**
   * Delete multiple files using their ARNs
   * @param arnList Array of ARNs of the files to delete
   */
  async deleteFiles(...arnList: string[]) {
    const deletePromises = arnList.map((arn) => {
      const { bucket, objectName } = this.extractArn(arn);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: objectName,
      });

      return this.s3Client.send(deleteCommand);
    });

    return Promise.allSettled(deletePromises);
  }

  /**
   * Upload a file to the specified bucket and scope
   *
   * @returns The ARN of the uploaded file
   */
  async uploadFile(
    options: {
      /**
       * File buffer data or path to the file to upload.
       */
      file: Buffer | string;
      fileSize?: number;
      contentType?: string;
    } & UploadOptions,
  ) {
    const {
      bucket,
      scope,
      file,
      fileName,
      fileSize,
      contentType = 'application/octet-stream',
    } = options;
    const objectName = scope ? `${scope}/${this.generateUuid()}` : this.generateUuid();

    const fileBuffer = Buffer.isBuffer(file)
      ? file
      : await fs.promises.readFile(file);

    const maxSizeInMb = this.storageOptions.maxSizeInMb;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;
    if (fileBuffer.length > maxSizeInBytes) {
      throw new BadRequestException(
        `File size exceeds the maximum limit of ${maxSizeInMb} MB`,
      );
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectName,
      Body: fileBuffer,
      ContentType: contentType,
      Metadata: {
        'file-name': fileName ? encodeURIComponent(fileName) : '',
        'file-size': fileSize ? fileSize.toString() : '',
      },
    });

    await this.s3Client.send(command);

    return `s3:${bucket}:${objectName}`;
  }

  private generateUuid(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
