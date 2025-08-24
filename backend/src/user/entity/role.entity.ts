import {
  Entity,
  Column,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

@Entity('roles')
export class Role extends BaseAuditEntity {
  @Column({ unique: true, name: 'name' })
  name: string;

  @Column({ nullable: true, name: 'description' })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
