import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventMedia } from './entity/event-media.entity';
import { EventMediaService } from './event-media.service';
import { EventMediaController } from './event-media.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventMedia]), CommonModule],
  controllers: [EventMediaController],
  providers: [EventMediaService],
  exports: [EventMediaService],
})
export class EventMediaModule {}
