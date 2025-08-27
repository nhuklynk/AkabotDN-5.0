import { Entity, Column, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { Event } from '../../event/entity/event.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('categories')
export class Category extends BaseAuditEntity {
  @Column({ unique: true, name: 'name' })
  name: string;

  @Column({ unique: true, name: 'slug' })
  slug: string;

  @Column({ nullable: true, name: 'description' })
  description?: string;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @ManyToMany(() => Post, (post) => post.categories, { nullable: true, onDelete: 'CASCADE' })
  posts: Post[];

  @ManyToMany(() => Event, (event) => event.categories, { nullable: true, onDelete: 'CASCADE' })
  events: Event[];
}
