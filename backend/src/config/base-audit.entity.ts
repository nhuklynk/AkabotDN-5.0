import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export abstract class BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
    name: 'status',
    enumName: 'status_enum'
  })
  status: Status;

  @Column()
  created_by: string;

  @Column()
  created_at: Date;

  @Column()
  modified_by: string;
  
  @Column()
  modified_at: Date;
}
