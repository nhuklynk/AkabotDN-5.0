/**
 * Example usage of Storage Service
 * 
 * This file demonstrates how to use the StorageService in your application
 */

import { StorageService } from '../storage.service';

// Example 1: Get upload policy for direct S3 upload
async function getUploadPolicyExample(storageService: StorageService) {
  try {
    const policy = await storageService.getUploadPolicy({
      bucket: 'akabotdn',
      scope: 'images',
      fileName: 'profile.jpg',
      expiresInSeconds: 3600, // 1 hour
    });

    console.log('Upload Policy:', policy);
    // Returns: { policy: {...}, arn: 's3:akabotdn:images/abc123' }
    
    return policy;
  } catch (error) {
    console.error('Failed to get upload policy:', error);
  }
}

// Example 2: Upload file directly
async function uploadFileExample(storageService: StorageService) {
  try {
    const fileBuffer = Buffer.from('Hello World!');
    
    const arn = await storageService.uploadFile({
      file: fileBuffer,
      bucket: 'akabotdn',
      scope: 'documents',
      fileName: 'hello.txt',
      contentType: 'text/plain',
      fileSize: fileBuffer.length,
    });

    console.log('File uploaded successfully:', arn);
    // Returns: 's3:akabotdn:documents/abc123'
    
    return arn;
  } catch (error) {
    console.error('Failed to upload file:', error);
  }
}

// Example 3: Get download URL
async function getDownloadUrlExample(storageService: StorageService) {
  try {
    const arn = 's3:akabotdn:images/profile.jpg';
    const downloadUrl = await storageService.getDownloadUrl(arn, 300); // 5 minutes
    
    console.log('Download URL:', downloadUrl);
    // Returns: 'https://...' (presigned URL)
    
    return downloadUrl;
  } catch (error) {
    console.error('Failed to get download URL:', error);
  }
}

// Example 4: Delete files
async function deleteFilesExample(storageService: StorageService) {
  try {
    const arns = [
      's3:akabotdn:images/old-profile.jpg',
      's3:akabotdn:documents/temp.txt'
    ];
    
    const results = await storageService.deleteFiles(...arns);
    
    console.log('Delete results:', results);
    // Returns: Array of PromiseSettledResult
    
    return results;
  } catch (error) {
    console.error('Failed to delete files:', error);
  }
}

// Example 5: Upload with different scopes
async function uploadWithScopesExample(storageService: StorageService) {
  try {
    // Upload to different scopes for organization
    const scopes = ['users', 'products', 'news'];
    
    for (const scope of scopes) {
      const arn = await storageService.uploadFile({
        file: Buffer.from(`Content for ${scope}`),
        bucket: 'akabotdn',
        scope,
        fileName: `example-${scope}.txt`,
        contentType: 'text/plain',
      });
      
      console.log(`Uploaded to ${scope}:`, arn);
    }
  } catch (error) {
    console.error('Failed to upload with scopes:', error);
  }
}

export {
  getUploadPolicyExample,
  uploadFileExample,
  getDownloadUrlExample,
  deleteFilesExample,
  uploadWithScopesExample,
};
