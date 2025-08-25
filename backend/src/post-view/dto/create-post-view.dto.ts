import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostViewDto {
  @ApiProperty({
    description: 'Post ID that was viewed',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  post_id: string;

  @ApiProperty({
    description: 'Time when the post was viewed',
    example: '2023-12-01T10:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  time?: Date;
}
