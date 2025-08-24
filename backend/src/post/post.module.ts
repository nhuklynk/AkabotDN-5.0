import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { Post } from './entity/post.entity';
import { Category } from '../category/entity/category.entity';
import { PostController } from './post.controller';
import { Tag } from 'src/tag/entity/tag.entity';
import { User } from '../user/entity/user.entity';
import { Comment } from '../comment/entity/comment.entity';
import { CommonModule } from '../common/common.module';
import { StorageModule } from 'src/storage';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, Tag, User, Comment]), CommonModule, StorageModule, MediaModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
