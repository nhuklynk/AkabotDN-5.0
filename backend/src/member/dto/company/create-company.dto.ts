import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  tax_number: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsOptional()
  @IsString()
  business_registration_form_url?: string;
}
