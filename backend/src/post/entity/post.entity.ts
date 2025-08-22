import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Media } from '../../media/entity/media.entity';
import { Category } from '../../category/entity/category.entity';
import { Tag } from '../../tag/entity/tag.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled',
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
    name: 'post_status'
  })
  post_status: PostStatus;

  @Column({ nullable: true, name: 'summary' })
  summary?: string;

  @Column({ nullable: true, name: 'published_at' })
  published_at?: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Category, (category) => category.posts)
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.posts)
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
