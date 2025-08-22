import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadFileDto {
  @ApiProperty({ 
    description: 'ARN of the file to download (format: s3:bucket:path)',
    example: 's3:akabotdn:knowledge/example.txt'
  })
  @IsString()
  @IsNotEmpty()
  arn: string;
}
