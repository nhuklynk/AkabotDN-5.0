import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment. This is the main text that will be displayed.',
    example: 'This is a great article! Thank you for sharing this valuable information.',
    minLength: 1,
    maxLength: 2000,
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The UUID of the post that this comment belongs to. This links the comment to a specific blog post.',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  comment_type_id: string;

  @ApiProperty({
    description: 'The type of the comment. This is used to link the comment to a specific post or event.',
    example: 'post'
  })
  @IsString()
  comment_type: string;

  @ApiPropertyOptional({
    description: 'The UUID of the parent comment if this is a reply to another comment. Leave empty for top-level comments.',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @ApiPropertyOptional({
    description: 'The UUID of the user who is creating the comment. This is used to link the comment to a specific user.',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsOptional()
  @IsUUID()
  author_id?: string;
}
