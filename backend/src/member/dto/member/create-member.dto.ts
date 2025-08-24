import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { MembershipType, ExpertiseLevel } from '../../entity/member.entity';

export class CreateMemberDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsUUID()
  company_id?: string;

  @IsOptional()
  @IsEnum(MembershipType)
  membership_type?: MembershipType;

  @IsOptional()
  @IsString()
  job_title?: string;

  @IsOptional()
  @IsString()
  assistant_info?: string;

  @IsOptional()
  @IsString()
  membership_registration_form_url?: string;

  @IsOptional()
  @IsString()
  work_unit?: string;

  @IsOptional()
  @IsEnum(ExpertiseLevel)
  expertise_level?: ExpertiseLevel;

  @IsOptional()
  @IsString()
  curriculum_vitae_url?: string;
}
