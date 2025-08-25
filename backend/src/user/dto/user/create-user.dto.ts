import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    description: 'User phone number (optional, must be unique if provided)',
    example: '0909090909',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'Phone number must contain only digits, spaces, hyphens, parentheses and plus signs'
  })
  phone?: string;

  @ApiProperty({
    description: 'Role ID to assign (optional)',
    example: '550e8400-e29b-41d4-a716-446655440004',
    required: false
  })
  @IsOptional()
  role_id?: string;

  @ApiProperty({
    description: 'User status (optional, default: active)',
    example: 'active',
    required: false
  })
  @IsOptional()
  status?: string;
}
