import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Post } from '../../post/entity/post.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

export enum MediaType {
  POST = 'post',
  EVENT = 'event',
  MEMBER = 'member',
  OTHER = 'other',
  DOCUMENT_VIDEO = 'document_video',
  DOCUMENT_IMAGE = 'document_image',
}

@Entity('media')
export class Media extends BaseAuditEntity {
  @Column({ name: 'file_name' })
  file_name: string;

  @Column({ name: 'mime_type' })
  mime_type: string;

  @Column({ name: 'file_size' })
  file_size: number;

  @Column({ name: 'file_path' })
  file_path: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.OTHER,
    name: 'media_type'
  })
  media_type: MediaType;

}