import { Expose, Type } from 'class-transformer';
import { MemberResponseDto } from '../member/member-response.dto';

export class CompanyResponseDto {
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

  @Expose()
  @Type(() => MemberResponseDto)
  members?: MemberResponseDto[];

  constructor(partial: Partial<CompanyResponseDto>) {
    Object.assign(this, partial);
  }
}
