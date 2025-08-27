import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('faqs')
export class Faq extends BaseAuditEntity {

  @Column({ type: 'text', name: 'content' })
  content: string;
}
