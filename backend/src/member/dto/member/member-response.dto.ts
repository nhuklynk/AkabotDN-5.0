import { Expose, Type } from 'class-transformer';
import { MembershipType, ExpertiseLevel } from '../../entity/member.entity';
import { MemberCompanyDto } from './member-company.dto';

export class MemberResponseDto {
  @Expose()
  id: string;

  @Expose()
  membership_type: MembershipType;

  @Expose()
  job_title: string;

  @Expose()
  assistant_info: string;

  @Expose()
  membership_registration_form_url: string;

  @Expose()
  work_unit: string;

  @Expose()
  expertise_level: ExpertiseLevel;

  @Expose()
  curriculum_vitae_url: string;

  @Expose()
  joined_at: Date;

  @Expose()
  @Type(() => Object)
  user?: any;

  @Expose()
  @Type(() => MemberCompanyDto)
  company?: MemberCompanyDto;

  constructor(partial: Partial<MemberResponseDto>) {
    Object.assign(this, partial);
  }
}
