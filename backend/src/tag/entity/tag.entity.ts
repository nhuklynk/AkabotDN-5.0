import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
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

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'content_tags',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  posts: Post[];
}
