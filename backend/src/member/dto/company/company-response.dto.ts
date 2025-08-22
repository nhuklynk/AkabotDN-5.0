import { Expose, Type } from 'class-transformer';

export class CompanyResponseDto {
  @Expose()
  company_id: string;

  @Expose()
  name: string;

  @Expose()
  tax_number: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: string;

  @Expose()
  business_registration_form_url: string;

  @Expose()
  @Type(() => Array)
  members?: any[];

  constructor(partial: Partial<CompanyResponseDto>) {
    Object.assign(this, partial);
  }
}
