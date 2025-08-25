import { IsString, IsOptional, IsEnum, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MembershipType, ExpertiseLevel } from '../../entity/member.entity';
import { Status } from '../../../config/base-audit.entity';

export class RegisterMemberDto {
  // User information
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  full_name: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+84123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'User status',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  // Member information
  @ApiProperty({
    description: 'Company ID (optional for individual members)',
    example: '550e8400-e29b-41d4-a716-446655440701',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  company_id?: string;

  @ApiProperty({
    description: 'Membership type',
    enum: MembershipType,
    default: MembershipType.INDIVIDUAL,
  })
  @IsOptional()
  @IsEnum(MembershipType)
  membership_type?: MembershipType;

  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
    required: false,
  })
  @IsOptional()
  @IsString()
  job_title?: string;

  @ApiProperty({
    description: 'Assistant information',
    example: 'AI-powered development assistant',
    required: false,
  })
  @IsOptional()
  @IsString()
  assistant_info?: string;

  @ApiProperty({
    description: 'Membership registration form URL',
    example: 'https://example.com/forms/member-registration.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  membership_registration_form_url?: string;

  @ApiProperty({
    description: 'Work unit',
    example: 'TechCorp Solutions',
    required: false,
  })
  @IsOptional()
  @IsString()
  work_unit?: string;

  @ApiProperty({
    description: 'Expertise level',
    enum: ExpertiseLevel,
    default: ExpertiseLevel.BEGINNER,
  })
  @IsOptional()
  @IsEnum(ExpertiseLevel)
  expertise_level?: ExpertiseLevel;

  @ApiProperty({
    description: 'Curriculum vitae URL',
    example: 'https://example.com/cv/john-doe.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  curriculum_vitae_url?: string;

  @ApiProperty({
    description: 'Role ID to assign (default: member role)',
    example: '550e8400-e29b-41d4-a716-446655440801',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  role_id?: string;
}
