import { IsString, IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { PostStatus } from '../entity/post.entity';
import { Status } from '../../config/base-audit.entity';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(PostStatus)
  post_status?: PostStatus;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsDateString()
  published_at?: string;

  @IsOptional()
  @IsUUID()
  primary_media_id?: string;

  @IsOptional()
  @IsUUID(undefined, { each: true })
  category_ids?: string[];

  @IsOptional()
  @IsUUID(undefined, { each: true })
  tag_ids?: string[];

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsUUID()
  user_id?: string;
}
