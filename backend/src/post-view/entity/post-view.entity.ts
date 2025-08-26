import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('post_views')
@Index(['post_id', 'view_date'])
export class PostView extends BaseAuditEntity {
  @Column({ name: 'post_id' })
  post_id: string;

  @Column({ name: 'view_date', type: 'timestamp' })
  view_date: Date;

  @Column({ default: 0 })
  view_count: number;
}
