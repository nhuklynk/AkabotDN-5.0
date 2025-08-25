import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { BaseAuditEntity } from '../../config/base-audit.entity';
import { Post } from '../../post/entity/post.entity';
import { Tag } from '../../tag/entity/tag.entity';
import { Category } from '../../category/entity/category.entity';

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

  @ManyToMany(() => Tag, (tag) => tag.events, { cascade: true })
  @JoinTable({
    name: 'event_tags',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[];

  @ManyToMany(() => Category, (category) => category.events, { cascade: true })
  @JoinTable({
    name: 'event_categories',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: Category[];
}
