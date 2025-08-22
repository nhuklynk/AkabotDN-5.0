import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

export enum DefaultRoles {
  ADMIN = 'admin',
  USER = 'user',
  EDITOR = 'editor',
  MODERATOR = 'moderator',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'RoleID' })
  roleId: string;

  @Column({ name: 'RoleName', nullable: false, unique: true })
  roleName: string;

  @Column({ name: 'Description', nullable: true })
  description: string;

  // Many-to-Many relationship with User
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}