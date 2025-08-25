import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  content?: string;
}
