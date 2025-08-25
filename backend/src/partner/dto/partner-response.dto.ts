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

  constructor(partial: Partial<PartnerResponseDto>) {
    Object.assign(this, partial);
  }
}
