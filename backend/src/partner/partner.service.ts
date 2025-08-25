import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Partner, PartnerType } from './entity/partner.entity';
import { plainToClass } from 'class-transformer';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerResponseDto } from './dto/partner-response.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerQueryDto } from './dto/partner-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginatedData } from '../common/interfaces/api-response.interface';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    private paginationService: PaginationService,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<PartnerResponseDto> {
    // Check if partner with name already exists
    const existingPartner = await this.partnerRepository.findOne({
      where: { name: createPartnerDto.name },
    });

    if (existingPartner) {
      throw new ConflictException('Partner with this name already exists');
    }

    const partner = this.partnerRepository.create(createPartnerDto);
    const savedPartner = await this.partnerRepository.save(partner);
    return plainToClass(PartnerResponseDto, savedPartner, { excludeExtraneousValues: true });
  }

  async searchAndPaginate(query: PartnerQueryDto): Promise<PaginatedData<PartnerResponseDto>> {
    const { skip, take, page, limit } = this.paginationService.createPaginationOptions(query);
  
    const qb = this.partnerRepository
      .createQueryBuilder('partner')
      .orderBy('partner.sort_order', 'ASC')
      .addOrderBy('partner.created_at', 'DESC')
      .skip(skip)
      .take(take);
  
    if (query.search) {
      qb.andWhere(
        '(LOWER(partner.name) LIKE LOWER(:search) OR LOWER(partner.description) LIKE LOWER(:search))',
        { search: `%${query.search}%` }
      );
    }
  
    if (query.partner_type) {
      qb.andWhere('partner.partner_type = :partner_type', { partner_type: query.partner_type });
    }
  
    const [partners, total] = await qb.getManyAndCount();
  
    const responseDtos = partners.map(p =>
      plainToClass(PartnerResponseDto, p, { excludeExtraneousValues: true })
    );
  
    return this.paginationService.createPaginatedResponse(
      responseDtos,
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<PartnerResponseDto> {
    const partner = await this.partnerRepository.findOne({
      where: { id: id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    return plainToClass(PartnerResponseDto, partner, { excludeExtraneousValues: true });
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<PartnerResponseDto> {
    const partner = await this.partnerRepository.findOne({
      where: { id: id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Check if name is being updated and if it already exists
    if (updatePartnerDto.name && updatePartnerDto.name !== partner.name) {
      const existingPartner = await this.partnerRepository.findOne({
        where: { name: updatePartnerDto.name },
      });

      if (existingPartner) {
        throw new ConflictException('Partner with this name already exists');
      }
    }

    await this.partnerRepository.update(id, updatePartnerDto);
    const updatedPartner = await this.partnerRepository.findOne({
      where: { id: id },
    });

    return plainToClass(PartnerResponseDto, updatedPartner, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<void> {
    const partner = await this.partnerRepository.findOne({
      where: { id: id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    await this.partnerRepository.remove(partner);
  }

  async findActivePartners(): Promise<PartnerResponseDto[]> {
    const partners = await this.partnerRepository.find({
      where: { partner_type: PartnerType.GOLD },
    });
    return partners.map(partner => plainToClass(PartnerResponseDto, partner, { excludeExtraneousValues: true }));
  }
}
