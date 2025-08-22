import { IsString, IsOptional, IsEnum, IsArray, IsUUID } from 'class-validator';
import { PostStatus } from '../entity/post.entity';
import { Status } from '../../config/base-audit.entity';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  post_status?: PostStatus;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsUUID()
  primary_media_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  category_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tag_ids?: string[];

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
