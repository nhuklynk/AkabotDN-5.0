export interface FileMetadata {
  originalName: string;
  mimeType: string;
  size: number;
  bucket: string;
  key: string;
  url?: string;
  uploadedAt: Date;
}

export interface UploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
}

export interface DownloadResult {
  success: boolean;
  data?: Buffer;
  metadata?: FileMetadata;
  error?: string;
}

export interface StorageConfig {
  minio: {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucketName: string;
    region: string;
  };
  upload: {
    maxFileSize: number;
    allowedMimeTypes: string[];
  };
}
