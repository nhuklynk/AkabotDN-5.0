import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;
}
