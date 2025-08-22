import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('categories')
export class Category extends BaseAuditEntity {
  @Column({ unique: true, name: 'name' })
  name: string;

  @Column({ unique: true, name: 'slug' })
  slug: string;

  @Column({ nullable: true, name: 'description' })
  description?: string;

  // Self-referencing relationship for hierarchical categories
  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'content_categories',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  posts: Post[];
}
