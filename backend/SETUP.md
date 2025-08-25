# AkaBot DN Backend Setup

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

## Quick Start

### 1. Clone và cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Tạo file .env

Tạo file `.env` trong thư mục `backend` với nội dung:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=akabotdn
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=30d

# Storage Configuration (AWS S3/MinIO)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin123
AWS_S3_ENDPOINT=http://localhost:9000
AWS_S3_FORCE_PATH_STYLE=true
AWS_S3_DEFAULT_BUCKET=akabotdn

# Upload Configuration
MAX_FILE_SIZE_MB=10
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application Configuration
PORT=3000
NODE_ENV=development

# API Keys
API_KEY_SECRET=your-api-key-secret-here
```

### 3. Khởi động services với Docker

```bash
# Khởi động tất cả services (PostgreSQL, MinIO, Redis)
docker-compose up -d

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f
```

### 4. Chạy ứng dụng

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## Services

### PostgreSQL Database
- **Host**: localhost:5432
- **Database**: akabotdn
- **User**: postgres
- **Password**: postgres

### MinIO Storage
- **API**: http://localhost:9000
- **Console**: http://localhost:9001
- **User**: minioadmin
- **Password**: minioadmin123

### Redis Cache
- **Host**: localhost:6379
- **No password** (development only)

## API Documentation

Sau khi khởi động ứng dụng, truy cập:
- **Swagger UI**: http://localhost:3000/api
- **API Base URL**: http://localhost:3000

## Storage Service Usage

### Upload Policy
```bash
curl -X POST http://localhost:3000/storage/upload-policy \
  -H "Content-Type: application/json" \
  -d '{
    "bucket": "akabotdn",
    "scope": "images",
    "fileName": "example.jpg",
    "expiresInSeconds": 3600
  }'
```

**Lưu ý**: 
- Upload policy có hiệu lực trong **1 giờ**
- File trên MinIO **tồn tại vĩnh viễn** cho đến khi xóa
- Download URL có hiệu lực trong **5 phút**

### Upload File
```bash
curl -X POST http://localhost:3000/storage/upload \
  -F "file=@/path/to/your/file.jpg" \
  -F "bucket=akabotdn" \
  -F "scope=images" \
  -F "fileName=example.jpg"
```

### Get Download URL
```bash
curl http://localhost:3000/storage/download/s3:akabotdn:images/abc123.jpg
```

## Troubleshooting

### Docker Issues
1. Đảm bảo Docker Desktop đang chạy
2. Kiểm tra ports không bị conflict:
   ```bash
   netstat -an | findstr ":5432"
   netstat -an | findstr ":9000"
   netstat -an | findstr ":6379"
   ```

### Database Connection
```bash
# Test PostgreSQL connection
docker exec -it akabotdn-postgres psql -U postgres -d akabotdn
```

### MinIO Setup
1. Truy cập http://localhost:9001
2. Login với minioadmin/minioadmin123
3. Tạo bucket `akabotdn` nếu chưa có

### Storage Service
- Đảm bảo MinIO đang chạy
- Kiểm tra bucket `akabotdn` đã được tạo
- Verify AWS credentials trong .env

## Development Commands

```bash
# Install dependencies
npm install

# Start development
npm run start:dev

# Build
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

## Production Deployment

### Environment Variables
Đảm bảo các biến môi trường sau được set:

- `NODE_ENV=production`
- `JWT_SECRET` - Strong secret key
- `DATABASE_*` - Production database credentials
- `AWS_*` - Production S3 credentials
- `REDIS_*` - Production Redis credentials

### Docker Production
```bash
# Build production image
docker build -t akabotdn-backend .

# Run with production compose
docker-compose -f docker-compose.prod.yml up -d
```
