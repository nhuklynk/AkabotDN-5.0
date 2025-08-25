import { Expose, Type } from 'class-transformer';
import { MembershipType, ExpertiseLevel } from '../../entity/member.entity';
import { MemberCompanyDto } from './member-company.dto';
import { UserResponseDto } from '../../../user/dto/user/user-response.dto';

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
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @Expose()
  @Type(() => MemberCompanyDto)
  company?: MemberCompanyDto;

  constructor(partial: Partial<MemberResponseDto>) {
    Object.assign(this, partial);
  }
}
