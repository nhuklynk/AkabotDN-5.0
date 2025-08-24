import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { Member } from './member.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('companies')
export class Company extends BaseAuditEntity {
  @Column({ unique: true, name: 'name' })
  name: string;
  
  @Column({ nullable: true, name: 'tax_number' })
  tax_number?: string;

  @Column({ nullable: true, name: 'email' })
  email?: string;

  @Column({ nullable: true, name: 'phone_number' })
  phone_number?: string;

  @Column({ nullable: true, name: 'business_registration_form_url' })
  business_registration_form_url?: string;

  @OneToMany(() => Member, (member) => member.company)
  members: Member[];
}
