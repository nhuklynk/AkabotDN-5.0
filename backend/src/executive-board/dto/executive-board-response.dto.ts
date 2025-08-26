import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ExecutiveBoardResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Unit (including rank and name)',
    example: 'General Luong Tam Quang'
  })
  unit: string;

  @Expose()
  @ApiProperty({
    description: 'Position title',
    example: 'Chairman'
  })
  position_title: string;

  @Expose()
  @ApiProperty({
    description: 'Professional expertise and other positions',
    example: 'Member of Politburo, Minister of Public Security',
    required: false
  })
  professional_expertise?: string;

  @Expose()
  @Expose()
  @ApiProperty({
    description: 'Active status',
    example: true
  })
  is_active: boolean;

  @Expose()
  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z'
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z'
  })
  updated_at: Date;

  constructor(partial: Partial<ExecutiveBoardResponseDto>) {
    Object.assign(this, partial);
  }
}
