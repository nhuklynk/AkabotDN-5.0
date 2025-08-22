import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'UserID' })
  userId: string;

  @Column({ name: 'Email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'PasswordHash', nullable: false })
  passwordHash: string;

  @Column({ name: 'FullName', nullable: false })
  fullName: string;

  @Column({ name: 'Avatar', nullable: true })
  avatar: string;

  @Column({ name: 'Phone', nullable: true })
  phone: string;

  @Column({
    name: 'Status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;

  // Many-to-Many relationship with Role (TypeORM sẽ tự tạo bảng user_roles)
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'UserID',
      referencedColumnName: 'userId',
    },
    inverseJoinColumn: {
      name: 'RoleID',
      referencedColumnName: 'roleId',
    },
  })
  roles: Role[];
}