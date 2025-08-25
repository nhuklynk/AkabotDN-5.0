import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
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
   * Ensure bucket exists, create if it doesn't
   */
  private async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      // Check if bucket exists
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (error) {
      // Bucket doesn't exist, create it
      try {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket '${bucketName}' created successfully`);
      } catch (createError) {
        console.error(`Failed to create bucket '${bucketName}':`, createError);
        throw new BadRequestException(`Failed to create bucket '${bucketName}'`);
      }
    }
  }

  /**
   * Get a pre-signed URL for downloading the file with the given ARN
   * Example: s3:knowledge:example.txt
   */
  async getDownloadUrl(arn: string, expiresInSeconds = 5 * 60) {
    const { bucket, objectName } = this.extractArn(arn);
    
    // Ensure bucket exists before proceeding
    await this.ensureBucketExists(bucket);

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
    if (!options) {
      throw new BadRequestException('Upload options are required');
    }
    
    const { bucket, fileName, scope, expiresInSeconds = 60 * 60 } = options;
    
    if (!bucket) {
      throw new BadRequestException('Bucket is required');
    }
    
    // Ensure bucket exists before proceeding
    await this.ensureBucketExists(bucket);
    
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
    // Group by bucket to check existence once per bucket
    const bucketGroups = new Map<string, string[]>();
    
    for (const arn of arnList) {
      const { bucket, objectName } = this.extractArn(arn);
      if (!bucketGroups.has(bucket)) {
        bucketGroups.set(bucket, []);
      }
      bucketGroups.get(bucket)!.push(objectName);
    }
    
    // Ensure all buckets exist before proceeding
    for (const bucket of bucketGroups.keys()) {
      await this.ensureBucketExists(bucket);
    }
    
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
    
    // Ensure bucket exists before proceeding
    await this.ensureBucketExists(bucket);
    
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

  /**
   * Download file by ARN with direct path
   * ARN format: s3:bucket:path/to/file (e.g., s3:akabotdn:knowledge/example.txt)
   */
  async downloadFileByArn(arn: string) {
    const [service, bucket, objectPath] = arn.split(':');
    
    if (service !== 's3') {
      throw new BadRequestException(`Invalid service ${service}`);
    }

    if (!bucket) {
      throw new BadRequestException(`Invalid bucket ${bucket}`);
    }

    if (!objectPath) {
      throw new BadRequestException(`Invalid object path ${objectPath}`);
    }

    const key = objectPath;

    // Ensure bucket exists before proceeding
    await this.ensureBucketExists(bucket);

    // Check if file exists and get metadata
    let fileName = '';
    let contentType = 'application/octet-stream';
    
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      const headResult = await this.s3Client.send(headCommand);
      
      fileName =
        (headResult as any).Metadata?.['x-file-name'] ||
        (headResult as any).Metadata?.['file-name'] ||
        objectPath.split('/').pop() || objectPath;

      contentType = (headResult as any).ContentType || contentType;
    } catch (err) {
      throw new BadRequestException('File does not exist');
    }

    // Get file content
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const result = await this.s3Client.send(command);

    // Convert stream to Buffer
    const streamToBuffer = (stream: any) =>
      new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });

    const fileContent = await streamToBuffer(result.Body);

    return {
      fileContent,
      fileName: decodeURIComponent(fileName),
      contentType,
    };
  }
}
