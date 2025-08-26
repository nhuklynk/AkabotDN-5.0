import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutBucketPolicyCommand,
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
  async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (err: any) {
      if (err.$metadata?.httpStatusCode === 404) {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));

        const policy = {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:GetObject"],
              Resource: `arn:aws:s3:::${bucketName}/*`,
            },
          ],
        };

        await this.s3Client.send(
          new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(policy),
          })
        );
      } else {
        throw new Error(`Cannot check/create bucket '${bucketName}'`);
      }
    }
  }

  /**
   * Get a pre-signed URL for downloading the file with proper filename in content-disposition
   * This will make the browser use the correct filename when downloading
   */
  async getDownloadUrlWithFilename(arn: string, expiresInSeconds = 5 * 60) {
    const { bucket, objectName } = this.extractArn(arn);
    
    // Ensure bucket exists before proceeding
    await this.ensureBucketExists(bucket);

    const key = objectName;

    // Get file metadata to extract filename
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
        objectName?.split('/').pop() || 
        key.split('/').pop() || 
        key;

      contentType = (headResult as any).ContentType || contentType;
      
      // Decode filename if it was URL encoded
      if (fileName) {
        try {
          fileName = decodeURIComponent(fileName);
        } catch (e) {
          // If decoding fails, use as is
        }
      }
    } catch (err) {
      // Use fallback values
      fileName = key.split('/').pop() || key;
    }

    // Create download command with response-content-disposition header
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      ResponseContentType: contentType,
    });

    const downloadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: Math.max(expiresInSeconds, 10),
    });

    return {
      downloadUrl,
      fileName,
      contentType,
      arn,
      bucket,
      key,
      expiresInSeconds,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString()
    };
  }

  async getFileUrl(arn: string): Promise<string> {
    const [s3, bucket, key] = arn.split(':');
    if (!bucket || !key) throw new NotFoundException('Invalid ARN');
    const expiresIn = this.configService.get<number>('SIGNED_URL_EXPIRES_IN', 300);
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(this.s3Client, command);
  }

  /**
   * Get a pre-signed policy for uploading a file to the specified bucket
   */
  async getUploadPolicy(
    options: {
      expiresInSeconds?: number;
    } & UploadOptions,
  ) {
    if (!options) {
      throw new BadRequestException('Upload options are required');
    }
    
    const { bucket, scope, expiresInSeconds = 60 * 60 } = options;
    
    if (!bucket) {
      throw new BadRequestException('Bucket is required');
    }
    
    // Ensure bucket exists before proceeding
    await this.ensureBucketExists(bucket);
    
    const objectName = scope ? `${scope}/${this.generateUuid()}` : this.generateUuid();

    const maxSizeInMb = this.storageOptions.maxSizeInMb;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    const postPolicy = await createPresignedPost(this.s3Client, {
      Bucket: bucket,
      Key: objectName,
      Conditions: [['content-length-range', 1, maxSizeInBytes]],
      Fields: {},
      Expires: expiresInSeconds,
    });

    return {
      policy: postPolicy,
      arn: `s3:${bucket}:${objectName}`,
    };
  }

  /**
   * Upload a file to the specified bucket and scope
   */
  async uploadFile(
    options: {
      file: Buffer | string;
      fileName: string;
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
        'x-file-name': fileName ? encodeURIComponent(fileName) : '',
        'x-file-size': fileSize ? fileSize.toString() : '',
      },
    });

    await this.s3Client.send(command);

    return `s3:${bucket}:${objectName}`;
  }

  /**
   * Delete multiple files using their ARNs
   */
  async deleteFiles(...arnList: string[]) {
    
    // Group by bucket to check existence once per bucket
    const bucketGroups = new Map<string, string[]>();
    
    for (const arn of arnList) {
      try {
        const { bucket, objectName } = this.extractArn(arn);
        
        if (!bucketGroups.has(bucket)) {
          bucketGroups.set(bucket, []);
        }
        bucketGroups.get(bucket)!.push(objectName);
      } catch (error) {
        throw error;
      }
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
   * Download file by ARN with direct path
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

  /**
   * Extract ARN components
   */
  private extractArn(arn: string) {
    
    if (!arn || typeof arn !== 'string') {
      throw new BadRequestException(`Invalid ARN: ${arn}`);
    }
    
    const parts = arn.split(':');
    
    if (parts.length !== 3) {
      throw new BadRequestException(`Invalid ARN format. Expected format: s3:bucket:path, got: ${arn} with ${parts.length} parts`);
    }
    
    const [service, bucket, objectName] = parts;
    
    if (service !== 's3') {
      throw new BadRequestException(`Invalid service: ${service}. Expected: s3`);
    }

    if (!bucket || bucket.trim() === '') {
      throw new BadRequestException(`Invalid bucket name: ${bucket}`);
    }

    if (!objectName || objectName.trim() === '') {
      throw new BadRequestException(`Invalid object name: ${objectName}`);
    }

    return {
      service,
      bucket,
      objectName,
    };
  }

  /**
   * Generate unique identifier for file names
   */
  private generateUuid(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
