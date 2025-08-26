import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('executive_board')
export class ExecutiveBoard extends BaseAuditEntity {
  @Column({ name: 'unit', length: 255 })
  @Index()
  unit: string;

  @Column({ name: 'position_title', length: 255 })
  @Index()
  position_title: string;

  @Column({ name: 'professional_expertise', type: 'text', nullable: true })
  professional_expertise?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;
}
