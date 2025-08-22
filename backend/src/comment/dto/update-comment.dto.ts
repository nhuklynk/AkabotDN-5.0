import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  post_id?: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;
}
