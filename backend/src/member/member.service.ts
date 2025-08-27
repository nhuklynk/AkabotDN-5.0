import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Member } from './entity/member.entity';
import { MemberResponseDto } from './dto/member/member-response.dto';
import { CreateMemberDto } from './dto/member/create-member.dto';
import { UpdateMemberDto } from './dto/member/update-member.dto';
import { RegisterMemberDto } from './dto/member/register-member.dto';
import { RegisterMemberResponseDto } from './dto/member/register-member-response.dto';
import { User } from '../user/entity/user.entity';
import { UserResponseDto } from '../user/dto/user/user-response.dto';
import { UserService } from '../user/user.service';
import { Role } from '../user/entity/role.entity';
import { Status } from '../config/base-audit.entity';
import { MemberQueryDto } from './dto/member-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginatedData } from '../common/interfaces/api-response.interface';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private paginationService: PaginationService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private userService: UserService,
  ) {}

  async registerMember(
    registerMemberDto: RegisterMemberDto,
  ): Promise<RegisterMemberResponseDto> {
    // Create user using UserService with role and pending status
    const createUserDto = {
      email: registerMemberDto.email,
      password: registerMemberDto.password,
      full_name: registerMemberDto.full_name,
      phone: registerMemberDto.phone,
      avatar: registerMemberDto.avatar,
      role_id: registerMemberDto.role_id, // Pass role_id to UserService
      status: Status.PENDING, // Set status to pending for new members
    };

    const savedUser = await this.userService.create(createUserDto);

    // Create member
    const memberData: any = {
      user: savedUser,
      membership_type: registerMemberDto.membership_type || 'individual',
      job_title: registerMemberDto.job_title,
      assistant_info: registerMemberDto.assistant_info,
      membership_registration_form_url:
        registerMemberDto.membership_registration_form_url,
      work_unit: registerMemberDto.work_unit,
      expertise_level: registerMemberDto.expertise_level || 'beginner',
      curriculum_vitae_url: registerMemberDto.curriculum_vitae_url,
      joined_at: new Date(),
      created_by: 'system',
      modified_by: 'system',
    };

    if (registerMemberDto.company_id) {
      memberData.company = { id: registerMemberDto.company_id };
    }

    const member = this.memberRepository.create(memberData);

    const savedMember = await this.memberRepository.save(member);

    // Get the created member with relations
    const memberWithRelations = await this.findOne((savedMember as any).id);

    // Add roles to member response
    const memberWithRoles = {
      ...memberWithRelations,
      roles:
        savedUser.roles?.map((role) => ({
          id: role.id,
          name: role.name,
        })) || [],
    };

    return new RegisterMemberResponseDto({
      message: 'Member registered successfully',
      member: memberWithRoles,
    });
  }

  async create(createMemberDto: CreateMemberDto): Promise<MemberResponseDto> {
    // Check if user already has a member record (one-to-one relationship)
    const existingMember = await this.findByUser(createMemberDto.user_id);
    if (existingMember) {
      throw new BadRequestException(
        `User ${createMemberDto.user_id} already has a member record`,
      );
    }

    const member = this.memberRepository.create(createMemberDto);
    const savedMember = await this.memberRepository.save(member);
    return this.findOne(savedMember.id);
  }

  async searchAndPaginate(
    query: MemberQueryDto,
  ): Promise<PaginatedData<MemberResponseDto>> {
    const { skip, take, page, limit } =
      this.paginationService.createPaginationOptions(query);

    // Build where conditions
    const whereConditions: any = {};

    if (query.search) {
      // Search in user email or member-related fields
      whereConditions.user = [
        { email: Like(`%${query.search}%`) },
        { full_name: Like(`%${query.search}%`) },
      ];
    }

    if (query.company_id) {
      whereConditions.company_id = query.company_id;
    }

    if (query.status) {
      whereConditions.status = query.status;
    }

    const [members, total] = await this.memberRepository.findAndCount({
      where: whereConditions,
      relations: ['user', 'company'],
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    const responseDtos = members.map((member) =>
      plainToClass(MemberResponseDto, member, {
        excludeExtraneousValues: true,
      }),
    );

    return this.paginationService.createPaginatedResponse(
      responseDtos,
      total,
      page,
      limit,
    );
  }

  async findAll(): Promise<MemberResponseDto[]> {
    const members = await this.memberRepository.find({
      relations: ['user', 'company'],
    });

    return members.map((member) =>
      plainToClass(MemberResponseDto, member, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { id: id },
      relations: ['user', 'company'],
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return plainToClass(MemberResponseDto, member, {
      excludeExtraneousValues: true,
    });
  }

  async findByUser(user_id: string): Promise<MemberResponseDto | null> {
    const member = await this.memberRepository.findOne({
      where: { user: { id: user_id } },
      relations: ['user', 'company'],
    });
    return member
      ? plainToClass(MemberResponseDto, member, {
          excludeExtraneousValues: true,
        })
      : null;
  }

  async findByCompany(company_id: string): Promise<MemberResponseDto[]> {
    const members = await this.memberRepository.find({
      where: { company: { id: company_id } },
      relations: ['user', 'company'],
    });
    return members.map((member) =>
      plainToClass(MemberResponseDto, member, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async update(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { id: id },
      relations: ['user', 'company'],
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    // If updating user_id, check if the new user already has a member record
    if (updateMemberDto.user_id && updateMemberDto.user_id !== member.user.id) {
      const existingMember = await this.findByUser(updateMemberDto.user_id);
      if (existingMember) {
        throw new BadRequestException(
          `User ${updateMemberDto.user_id} already has a member record`,
        );
      }
    }

    await this.memberRepository.update(id, updateMemberDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{success: boolean, message: string }> {
    const member = await this.memberRepository.findOne({
      where: { id: id },
      relations: ['user', 'company'],
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    member.status = Status.INACTIVE;
    await this.memberRepository.save(member);

    if (member.user) {
      await this.userService.remove(member.user.id);
    }

    return {
      success: true,
      message: 'Member deactivated successfully',
    };
  }
}
