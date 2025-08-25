import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateFaqDto {

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;
}
