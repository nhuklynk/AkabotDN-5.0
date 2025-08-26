import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostViewDto {
  @ApiProperty({
    description: 'Post ID that was viewed',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  post_id: string;
}
