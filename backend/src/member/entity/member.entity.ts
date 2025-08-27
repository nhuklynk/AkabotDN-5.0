import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Company } from './company.entity';
import { BaseAuditEntity } from '../../config/base-audit.entity';

export enum MembershipType {
  INDIVIDUAL = 'individual',
  CORPORATE = 'corporate',
}

export enum ExpertiseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

@Entity('members')
export class Member extends BaseAuditEntity {
  @Column({
    type: 'enum',
    enum: MembershipType,
    default: MembershipType.INDIVIDUAL,
    name: 'membership_type'
  })
  membership_type: MembershipType;

  @Column({ nullable: true, name: 'job_title' })
  job_title?: string;

  @Column({ nullable: true, name: 'assistant_info' })
  assistant_info?: string;

  @Column({ nullable: true, name: 'membership_registration_form_url' })
  membership_registration_form_url?: string;

  @Column({ nullable: true, name: 'work_unit' })
  work_unit?: string;

  @Column({
    type: 'enum',
    enum: ExpertiseLevel,
    default: ExpertiseLevel.BEGINNER,
    name: 'expertise_level'
  })
  expertise_level: ExpertiseLevel;

  @Column({ nullable: true, name: 'curriculum_vitae_url' })
  curriculum_vitae_url?: string;

  @Column({ nullable: true, name: 'joined_at' })
  joined_at?: Date;

  @OneToOne(() => User, (user) => user.member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index({ unique: true })
  user: User;

  @ManyToOne(() => Company, (company) => company.members, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
