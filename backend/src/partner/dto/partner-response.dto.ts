import { Expose } from 'class-transformer';
import { PartnerType } from '../entity/partner.entity';

export class PartnerResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  logo: string;

  @Expose()
  website: string;

  @Expose()
  partner_type: PartnerType;

  @Expose()
  created_at: Date;

  @Expose()
  modified_at: Date;

  @Expose()
  created_by: string;

  @Expose()
  modified_by: string;

  constructor(partial: Partial<PartnerResponseDto>) {
    Object.assign(this, partial);
  }
}
