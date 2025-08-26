import { Entity, Column } from 'typeorm';
import { BaseAuditEntity, Status } from '../../config/base-audit.entity';

@Entity('subscriptions')
export class Subscription extends BaseAuditEntity {
  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: false })
  fullName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: false })
  phoneNumber: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ name: 'content', type: 'text', nullable: true })
  content: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
