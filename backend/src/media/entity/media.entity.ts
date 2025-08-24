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
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other',
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
    default: MediaType.AUDIO,
    name: 'media_type'
  })
  media_type: MediaType;

}
