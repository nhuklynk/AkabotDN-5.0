import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  Index,
} from 'typeorm';
import { Role } from './role.entity';
import { Media } from '../../media/entity/media.entity';
import { Post } from '../../post/entity/post.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { Member } from '../../member/entity/member.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('users')
export class User extends BaseAuditEntity {
  @Column({ unique: true, name: 'email' })
  email: string;

  @Column({ name: 'password_hash' })
  password_hash: string;

  @Column({ name: 'full_name' })
  full_name: string;

  @Column({ nullable: true, name: 'avatar' })
  avatar?: string;

  @Column({ nullable: true, name: 'phone' })
  phone?: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Member, (member) => member.user)
  memberships: Member[];
}
