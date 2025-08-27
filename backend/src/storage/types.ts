export interface StorageOptions {
  maxSizeInMb: number;
  defaultBucket: string;
  allowedMimeTypes: string[];
}

export interface UploadOptions {
  /**
   * The root directory for saving the file.
   */
  scope?: string;
}
