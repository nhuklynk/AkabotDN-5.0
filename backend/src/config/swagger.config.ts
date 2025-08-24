import { ApiProperty } from '@nestjs/swagger';

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
