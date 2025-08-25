import {
  Entity,
  Column,
} from 'typeorm';
import { BaseAuditEntity } from '../../config/base-audit.entity';

export enum PartnerType {
  STRATEGIC = 'strategic',
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
  ASSOCIATE = 'associate',
}

@Entity('partners')
export class Partner extends BaseAuditEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ nullable: true, name: 'description' })
  description?: string;

  @Column({ nullable: true, name: 'logo' })
  logo?: string;

  @Column({ nullable: true, name: 'website' })
  website?: string;

  @Column({
    type: 'enum',
    enum: PartnerType,
    default: PartnerType.GOLD,
    name: 'partner_type'
  })
  partner_type: PartnerType;

  @Column({ default: 0, name: 'sort_order' })
  sort_order: number;
}
