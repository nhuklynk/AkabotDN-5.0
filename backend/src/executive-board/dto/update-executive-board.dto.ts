import { PartialType } from '@nestjs/swagger';
import { CreateExecutiveBoardDto } from './create-executive-board.dto';

export class UpdateExecutiveBoardDto extends PartialType(CreateExecutiveBoardDto) {}
