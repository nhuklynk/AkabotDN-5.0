import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  PENDING = 'pending',
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

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ nullable: true })
  modified_by: string;
  
  @UpdateDateColumn({ name: 'modified_at' })
  modified_at: Date;

  @BeforeInsert()
  setAuditFieldsOnInsert() {
    const now = new Date();
    this.created_at = now;
    this.modified_at = now;
    
    // Set default values if not provided
    if (!this.created_by) {
      this.created_by = 'system';
    }
    if (!this.modified_by) {
      this.modified_by = this.created_by;
    }
  }

  @BeforeUpdate()
  setAuditFieldsOnUpdate() {
    this.modified_at = new Date();
    
    // Keep the original created_by if not set
    if (!this.modified_by) {
      this.modified_by = this.created_by || 'system';
    }
  }
}
