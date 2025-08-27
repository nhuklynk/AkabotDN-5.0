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
    description: 'Strong password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)',
    example: 'StrongPass123!',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { 
      message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)' 
    }
  )
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
    description: 'Role ID to assign (required)',
    example: '550e8400-e29b-41d4-a716-446655440004',
    required: true
  })
  @IsNotEmpty()
  role_id: string;

  @ApiProperty({
    description: 'User status (optional, default: active)',
    example: 'active',
    required: false
  })
  @IsOptional()
  status?: string;
}
