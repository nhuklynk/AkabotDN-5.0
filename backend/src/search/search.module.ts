import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../post/entity/post.entity';
import { Event } from '../event/entity/event.entity';
import { Tag } from '../tag/entity/tag.entity';
import { Category } from '../category/entity/category.entity';
import { Partner } from '../partner/entity/partner.entity';
import { Faq } from '../faq/entity/faq.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Event, Tag, Category, Partner, Faq]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}