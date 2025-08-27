import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

// Swagger configuration
export const swaggerConfig = new DocumentBuilder()
  .setTitle('AkabotDN API')
  .setDescription('API documentation for AkabotDN application')
  .setVersion('1.0')
  .addTag('users', 'User management endpoints')
  .addTag('posts', 'Post management endpoints')
  .addTag('categories', 'Category management endpoints')
  .addTag('tags', 'Tag management endpoints')
  .addTag('comments', 'Comment management endpoints')
  .addTag('media', 'Media management endpoints')
  .addTag('members', 'Member management endpoints')
  .addTag('companies', 'Company management endpoints')
  .addTag('faqs', 'FAQ management endpoints')
  .addTag('partners', 'Partner management endpoints')
  .addTag('storage', 'Storage management endpoints')
  .addBearerAuth()
  .build();

// Swagger custom options with export functionality
export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    // Export options
    exportOptions: {
      json: true,
      yaml: true,
    },
    // Custom CSS for better export appearance
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em; }
      .swagger-ui .info .description { font-size: 1.1em; }
    `,
    // Enable export buttons
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
  },
  // Custom site title
  customSiteTitle: 'AkabotDN API Documentation',
  // Enable JSON export endpoint
  jsonDocumentUrl: '/api/docs-json',
  // Enable YAML export endpoint
  yamlDocumentUrl: '/api/docs-yaml',
};

// Helper function để tạo API property với snake_case
export function ApiPropertySnakeCase(description: string, example?: any, required: boolean = true) {
  return ApiProperty({
    description,
    example,
    required,
  });
}

// Helper function để tạo API property cho ID
export function ApiPropertyId(description: string = 'Unique identifier') {
  return ApiProperty({
    description,
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  });
}

// Helper function để tạo API property cho date
export function ApiPropertyDate(description: string = 'Date and time') {
  return ApiProperty({
    description,
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  });
}

// Helper function để tạo API property cho enum
export function ApiPropertyEnum(enumType: any, description: string) {
  return ApiProperty({
    description,
    enum: enumType,
    example: Object.values(enumType)[0],
    required: true,
  });
}
