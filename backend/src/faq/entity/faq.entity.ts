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

  // Self-referencing relationship for hierarchical FAQs
  @ManyToOne(() => Faq, (faq) => faq.id, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Faq;
}
