import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Post } from '../../post/entity/post.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('comments')
export class Comment extends BaseAuditEntity {
  @Column({ type: 'text', name: 'content' })
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  // Self-referencing relationship for nested comments
  @ManyToOne(() => Comment, (comment) => comment.id, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  // @OneToMany(() => Comment, (comment) => comment.parent)
  // replies: Comment[];
}
