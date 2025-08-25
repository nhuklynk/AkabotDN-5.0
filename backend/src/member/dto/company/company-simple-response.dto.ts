import { Expose } from 'class-transformer';

export class CompanySimpleResponseDto {
  @Expose()
  id: string;

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

  constructor(partial: Partial<CompanySimpleResponseDto>) {
    Object.assign(this, partial);
  }
}
