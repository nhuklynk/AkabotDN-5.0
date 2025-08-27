import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like, Raw } from 'typeorm';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqResponseDto } from './dto/faq-response.dto';
import { plainToClass } from 'class-transformer';
import { Faq } from './entity/faq.entity';
import { FaqQueryDto } from './dto/faq-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginatedData } from '../common/interfaces/api-response.interface';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
    private paginationService: PaginationService,
  ) {}

  async create(createFaqDto: CreateFaqDto): Promise<FaqResponseDto> {
    const faq = this.faqRepository.create(createFaqDto);
    const savedFaq = await this.faqRepository.save(faq);
    return plainToClass(FaqResponseDto, savedFaq, {
      excludeExtraneousValues: true,
    });
  }

  async searchAndPaginate(
    query: FaqQueryDto,
  ): Promise<PaginatedData<FaqResponseDto>> {
    const { skip, take, page, limit } =
      this.paginationService.createPaginationOptions(query);

    const whereCondition = query.search
      ? {
          content: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, {
            search: `%${query.search}%`,
          }),
        }
      : {};

    const [faqs, total] = await this.faqRepository.findAndCount({
      where: whereCondition,
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    const responseDtos = faqs.map((faq) =>
      plainToClass(FaqResponseDto, faq, { excludeExtraneousValues: true }),
    );

    return this.paginationService.createPaginatedResponse(
      responseDtos,
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<FaqResponseDto> {
    const faq = await this.faqRepository.findOne({
      where: { id: id },
    });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return plainToClass(FaqResponseDto, faq, { excludeExtraneousValues: true });
  }

  async update(
    id: string,
    updateFaqDto: UpdateFaqDto,
  ): Promise<FaqResponseDto> {
    const faq = await this.faqRepository.findOne({
      where: { id: id },
    });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    const updatedFaq = await this.faqRepository.update(id, updateFaqDto);
    return plainToClass(FaqResponseDto, updatedFaq, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    await this.faqRepository.delete(id);
  }
}
