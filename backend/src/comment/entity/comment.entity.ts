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

  @ManyToOne(() => Comment, (comment) => comment.id, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @Column({ type: 'varchar', name: 'comment_type' })
  comment_type: string;

  @Column({ type: 'varchar', name: 'comment_type_id' })
  comment_type_id: string;
}
