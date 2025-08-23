import {
  Entity,
  Column,
  ManyToMany,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('tags')
export class Tag extends BaseAuditEntity {
  @Column({ unique: true, name: 'name' })
  name: string;

  @Column({ unique: true, name: 'slug' })
  slug: string;

  @Column({ nullable: true, name: 'description' })
  description?: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
