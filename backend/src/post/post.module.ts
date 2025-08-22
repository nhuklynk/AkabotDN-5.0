import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { Post } from './entity/post.entity';
import { Category } from '../category/entity/category.entity';
import { PostController } from './post.controller';
import { Tag } from 'src/tag/entity/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, Tag])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
