import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({ description: 'File to upload' })
  file: Express.Multer.File;

  @ApiProperty({ description: 'Custom folder path', required: false })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiProperty({ description: 'Custom file name', required: false })
  @IsOptional()
  @IsString()
  customName?: string;

  @ApiProperty({ description: 'File tags', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'File description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
