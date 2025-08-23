import {
  Entity,
  Column,
  OneToMany
} from 'typeorm';
import { BaseAuditEntity } from '../../config/base-audit.entity';
import { EventMedia } from '../../event-media/entity/event-media.entity';
import { Post } from 'src/post/entity/post.entity';

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('events')
export class Event extends BaseAuditEntity {

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;

  @Column({ type: 'varchar', nullable: true })
  thumbnail_url_id: string;

  @Column({ type: 'boolean', default: false })
  countdown_enabled: boolean;

  @Column({ 
    type: 'enum', 
    enum: EventStatus, 
    default: EventStatus.DRAFT
  })
  public_status: EventStatus;

  @OneToMany(() => EventMedia, (event_media) => event_media.event)
  event_media: EventMedia[];

  @OneToMany(() => Post, (post) => post.event)
  posts: Post[];
}
