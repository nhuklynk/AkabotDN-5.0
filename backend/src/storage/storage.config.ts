import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  maxSizeInMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  defaultBucket: process.env.AWS_S3_DEFAULT_BUCKET || 'akabotdn',
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
}));
