import { Expose } from 'class-transformer';

export class MemberCompanyDto {
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

  constructor(partial: Partial<MemberCompanyDto>) {
    Object.assign(this, partial);
  }
}