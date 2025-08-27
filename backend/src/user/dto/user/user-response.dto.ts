import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/config/base-audit.entity';

export class UserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  full_name: string;

  @Expose()
  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-01T00:00:00.000Z'
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'User last update date',
    example: '2024-01-01T00:00:00.000Z'
  })
  updated_at: Date;

  @Expose()
  avatar: string;

  @Expose()
  phone: string;

  @Expose()
  status: Status;

  @Expose()
  @ApiProperty({
    description: 'User roles',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' }
      }
    },
    example: [
      {
        id: 'role-1',
        name: 'admin'
      },
      {
        id: 'role-2',
        name: 'user'
      }
    ]
  })
  roles?: Array<{
    id: string;
    name: string;
  }>;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
