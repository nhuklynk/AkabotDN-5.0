import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
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

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  modified_at: Date;

  @ApiProperty()
  @Expose()
  created_by: string;

  @ApiProperty()
  @Expose()
  modified_by: string;
}
