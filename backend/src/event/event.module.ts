import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entity/event.entity';
import { Tag } from '../tag/entity/tag.entity';
import { Category } from '../category/entity/category.entity';
import { CommonModule } from '../common/common.module';
import { StorageModule } from 'src/storage';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Tag, Category]),
    CommonModule,
    StorageModule,
    MediaModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
