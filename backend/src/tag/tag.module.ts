import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './entity/tag.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), CommonModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
