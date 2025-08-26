import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutiveBoardController } from './executive-board.controller';
import { ExecutiveBoardService } from './executive-board.service';
import { ExecutiveBoard } from './entity/executive-board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExecutiveBoard])],
  controllers: [ExecutiveBoardController],
  providers: [ExecutiveBoardService],
  exports: [ExecutiveBoardService],
})
export class ExecutiveBoardModule {}
