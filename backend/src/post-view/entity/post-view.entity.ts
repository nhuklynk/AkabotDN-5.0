import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('post_views')
@Index(['post_id', 'time'])
@Index(['time'])
export class PostView extends BaseAuditEntity {
  @Column({ name: 'post_id' })
  post_id: string;

  @Column({ name: 'time', type: 'timestamp' })
  time: Date;
}
