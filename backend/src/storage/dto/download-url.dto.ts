import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadUrlDto {
  @ApiProperty({ 
    description: 'ARN of the file to get download URL (format: s3:bucket:path)',
    example: 's3:akabotdn:knowledge/example.txt'
  })
  @IsString()
  @IsNotEmpty()
  arn: string;

  @ApiProperty({ 
    description: 'Expiration time in seconds (default: 300 = 5 minutes)',
    example: 300,
    required: false,
    minimum: 10,
    maximum: 86400
  })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(86400) // 24 hours max
  expiresIn?: number;
}
