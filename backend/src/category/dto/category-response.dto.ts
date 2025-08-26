import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/config/base-audit.entity';

export class CategoryResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ required: false })
  @Expose()
  @Type(() => Object)
  parent?: any;

  @ApiProperty({ required: false })
  @Expose()
  @Type(() => Array)
  children?: any[];

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  modified_at: Date;

  @ApiProperty()
  @Expose()
  status: Status;
}