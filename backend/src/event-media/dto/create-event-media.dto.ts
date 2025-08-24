import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventMediaDto {
  @ApiProperty({ description: 'ID of the event this media belongs to' })
  @IsUUID()
  @IsNotEmpty()
  event_id: string;

  @ApiPropertyOptional({ description: 'ID of the attached file' })
  @IsOptional()
  @IsString()
  attach_file_id?: string;
}
