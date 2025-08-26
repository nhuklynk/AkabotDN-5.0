import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Category } from '../../category/entity/category.entity';
import { Tag } from '../../tag/entity/tag.entity';
import { Event } from '../../event/entity/event.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled',
}

export enum PostType {
  MEMBER_ACTIVITY = 'MEMBER_ACTIVITY',
  ASSOCIATION_ACTIVITY = 'ASSOCIATION_ACTIVITY',
  DIGITAL_PRODUCT = 'DIGITAL_PRODUCT',
}

@Entity('posts')
export class Post extends BaseAuditEntity {
  @Column({ name: 'title' })
  title: string;

  @Column({ unique: true, name: 'slug' })
  slug: string;

  @Column({ type: 'text', name: 'content' })
  content: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
    name: 'post_status',
  })
  post_status: PostStatus;

  @Column({ nullable: true, name: 'summary' })
  summary?: string;

  @Column({ nullable: true, name: 'published_at', type: 'timestamp' })
  published_at?: Date;

  @ManyToOne(() => User, (user) => user.posts, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'post_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.MEMBER_ACTIVITY,
    name: 'post_type',
  })
  post_type: PostType;

  @Column({ nullable: true, name: 'media_id' })
  media_id?: string;
}
