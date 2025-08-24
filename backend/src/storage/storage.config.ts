import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  s3: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    endpoint: process.env.AWS_S3_ENDPOINT || 'http://localhost:9000',
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true' || true,
    defaultBucket: process.env.AWS_S3_DEFAULT_BUCKET || 'akabotdn',
  },
  upload: {
    maxSizeInMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
    allowedMimeTypes: (process.env.ALLOWED_MIME_TYPES ? process.env.ALLOWED_MIME_TYPES.split(',') : [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ]),
  },
}));
