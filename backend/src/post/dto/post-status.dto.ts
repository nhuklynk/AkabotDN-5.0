import { ApiProperty } from '@nestjs/swagger';

export enum PostStatusDto {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled',
}

export class PostStatusResponseDto {
  @ApiProperty({
    description: 'Post status',
    enum: PostStatusDto,
    example: PostStatusDto.PUBLISHED
  })
  status: PostStatusDto;
}
