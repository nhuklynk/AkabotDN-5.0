import { Expose, Transform } from 'class-transformer';
import { PartnerType } from '../entity/partner.entity';

export class PartnerResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  logo?: string;

  @Expose()
  @Transform(({ value }) => value || null)
  logo_url?: string | null;

  @Expose()
  website?: string;

  @Expose()
  partner_type: PartnerType;

  @Expose()
  sort_order: number;

  @Expose()
  created_at: Date;

  @Expose()
  modified_at: Date;

  @Expose()
  created_by: string;

  @Expose()
  modified_by: string;

  @Expose()
  status: string;

  constructor(partial: Partial<PartnerResponseDto>) {
    Object.assign(this, partial);
  }
}
