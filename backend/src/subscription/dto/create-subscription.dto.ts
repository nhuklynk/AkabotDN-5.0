import { IsString, IsEmail, IsOptional, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Full name', example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  fullName: string;

  @ApiProperty({ description: 'Phone number', example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  phoneNumber: string;

  @ApiProperty({ description: 'Email address', example: 'example@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Message content', required: false, example: 'I want to receive information about new products' })
  @IsString()
  @IsOptional()
  content?: string;
}
