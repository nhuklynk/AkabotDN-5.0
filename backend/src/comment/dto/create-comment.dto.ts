import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsUUID()
  post_id: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;
}
