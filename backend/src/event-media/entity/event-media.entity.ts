import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseAuditEntity } from '../../config/base-audit.entity';
import { Event } from '../../event/entity/event.entity';

@Entity('event_medias')
export class EventMedia extends BaseAuditEntity {

  @Column({ type: 'varchar', name: 'event_id' })
  event_id: string;

  @Column({ type: 'varchar', length: 50, name: 'attach_file_id', nullable: true })
  attach_file_id: string;

  @ManyToOne(() => Event, (event) => event.event_media)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
