import { PartialType } from '@nestjs/swagger';
import { CreateEventMediaDto } from './create-event-media.dto';

export class UpdateEventMediaDto extends PartialType(CreateEventMediaDto) {}
