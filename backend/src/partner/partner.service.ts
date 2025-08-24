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
    
    let whereCondition: any = {};
    
    if (query.search) {
      whereCondition = [
        { name: Like(`%${query.search}%`) },
        { description: Like(`%${query.search}%`) }
      ];
    }
    
    if (query.partner_type) {
      if (query.search) {
        // If both search and partner_type are provided, we need to combine them
        whereCondition = whereCondition.map(condition => ({
          ...condition,
          partner_type: query.partner_type
        }));
      } else {
        whereCondition = { partner_type: query.partner_type };
      }
    }

    const [partners, total] = await this.partnerRepository.findAndCount({
      where: Object.keys(whereCondition).length > 0 ? whereCondition : {},
      skip,
      take,
      order: { sort_order: 'ASC', created_at: 'DESC' },
    });

    const responseDtos = partners.map(partner => 
      plainToClass(PartnerResponseDto, partner, { excludeExtraneousValues: true })
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
