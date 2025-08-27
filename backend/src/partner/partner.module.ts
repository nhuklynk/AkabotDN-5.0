import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerService } from './partner.service';
import { Partner } from './entity/partner.entity';
import { PartnerController } from './partner.controller';
import { CommonModule } from '../common/common.module';
import { StorageModule } from 'src/storage';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partner]), CommonModule, StorageModule, MediaModule],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
