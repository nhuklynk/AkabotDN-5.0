import { Expose, Type } from 'class-transformer';
import { Status } from '../../config/base-audit.entity';
import { TagResponseDto } from '../../tag/dto/tag-response.dto';
import { UserResponseDto } from 'src/user/dto/user/user-response.dto';
import { CategoryResponseDto } from 'src/category/dto/category-response.dto';

export class PostResponseDto {

  @Expose()
  id: string;


  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  content: string;

  @Expose()
  status: Status;

  @Expose()
  summary: string;

  @Expose()
  published_at: Date;

  @Expose()
  created_at: Date;

  @Expose()
  modified_at: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => CategoryResponseDto)
  categories: CategoryResponseDto[];

  @Expose()
  @Type(() => TagResponseDto)
  tags: TagResponseDto[];

  @Expose()
  media_id?: string;

  @Expose()
  created_by: string;

  @Expose()
  modified_by: string;
}
