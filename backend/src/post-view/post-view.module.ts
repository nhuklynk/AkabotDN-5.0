import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostViewService } from './post-view.service';
import { PostViewController } from './post-view.controller';
import { PostView } from './entity/post-view.entity';
import { Post } from '../post/entity/post.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostView, Post]),
    CommonModule,
  ],
  controllers: [PostViewController],
  providers: [PostViewService],
  exports: [PostViewService],
})
export class PostViewModule {}
