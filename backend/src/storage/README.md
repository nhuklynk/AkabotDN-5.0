# Storage Service

Storage service sử dụng AWS S3 để quản lý file upload/download với hệ thống ARN.

## Cấu hình

Thêm các biến môi trường sau vào file `.env`:

```env
# Storage Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_ENDPOINT=http://localhost:9000
AWS_S3_FORCE_PATH_STYLE=true
AWS_S3_DEFAULT_BUCKET=akabotdn

# Upload Configuration
MAX_FILE_SIZE_MB=10
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain
```

## Sử dụng

### 1. Upload Policy
Lấy policy để upload trực tiếp lên S3:
```typescript
POST /storage/upload-policy
{
  "bucket": "akabotdn",
  "scope": "images",
  "fileName": "example.jpg",
  "expiresInSeconds": 3600
}
```

### 2. Upload File
Upload file trực tiếp qua API:
```typescript
POST /storage/upload
Content-Type: multipart/form-data

file: [file]
bucket: "akabotdn"
scope: "images"
fileName: "example.jpg"
```

### 3. Download File
Lấy URL download:
```typescript
GET /storage/download/s3:akabotdn:images/abc123.jpg?expiresIn=300
```

### 4. Delete Files
Xóa file:
```typescript
DELETE /storage/file/s3:akabotdn:images/abc123.jpg
```

Xóa nhiều file:
```typescript
DELETE /storage/files
{
  "arns": [
    "s3:akabotdn:images/abc123.jpg",
    "s3:akabotdn:images/def456.png"
  ]
}
```

## ARN Format

ARN có format: `s3:[bucket]:[objectName]`

Ví dụ:
- `s3:akabotdn:images/profile.jpg`
- `s3:akabotdn:documents/report.pdf`
- `s3:akabotdn:uploads/temp/file.txt`

## Features

- ✅ Upload file với validation
- ✅ Presigned URL cho download (có thời hạn)
- ✅ Presigned Post policy cho upload trực tiếp (1 giờ)
- ✅ Delete file theo ARN
- ✅ File size validation
- ✅ MIME type validation
- ✅ Scope-based organization
- ✅ Metadata support

## ⏰ Thời gian hoạt động

- **Upload Policy**: Có hiệu lực trong **1 giờ** (thời gian để client upload)
- **Download URL**: Có hiệu lực trong **5 phút** (đảm bảo an toàn)
- **File trên MinIO**: **Tồn tại vĩnh viễn** cho đến khi xóa thủ công
