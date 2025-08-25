import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Member } from './entity/member.entity';
import { MemberResponseDto } from './dto/member/member-response.dto';
import { CreateMemberDto } from './dto/member/create-member.dto';
import { UpdateMemberDto } from './dto/member/update-member.dto';
import { MemberQueryDto } from './dto/member-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginatedData } from '../common/interfaces/api-response.interface';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private paginationService: PaginationService,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<MemberResponseDto> {
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
      whereConditions.membership_status = query.status;
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

  async findByUser(user_id: string): Promise<MemberResponseDto[]> {
    const members = await this.memberRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'company'],
    });
    return members.map((member) =>
      plainToClass(MemberResponseDto, member, {
        excludeExtraneousValues: true,
      }),
    );
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
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    await this.memberRepository.update(id, updateMemberDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { id: id },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    await this.memberRepository.remove(member);
  }
}
