import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqResponseDto } from './dto/faq-response.dto';
import { plainToClass } from 'class-transformer';
import { Faq } from './entity/faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async create(createFaqDto: CreateFaqDto): Promise<FaqResponseDto> {
    const faq = this.faqRepository.create(createFaqDto);
    const savedFaq = await this.faqRepository.save(faq);
    return this.findOne(savedFaq.id);
  }

  async findAll(): Promise<FaqResponseDto[]> {
    const faqs = await this.faqRepository.find();
    return faqs.map(faq => plainToClass(FaqResponseDto, faq, { excludeExtraneousValues: true }));
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

  async update(id: string, updateFaqDto: UpdateFaqDto): Promise<FaqResponseDto> {
    const faq = await this.faqRepository.findOne({
      where: { id: id },
    });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    await this.faqRepository.update(id, updateFaqDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const faq = await this.faqRepository.findOne({
      where: { id: id },
    });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    await this.faqRepository.remove(faq);
  }

  // async findRootFaqs(): Promise<FaqResponseDto[]> {
  //   const faqs = await this.faqRepository.find({
  //     where: { parent: IsNull() },
  //     relations: ['children'],
  //   });
  //   return faqs.map(faq => plainToClass(FaqResponseDto, faq, { excludeExtraneousValues: true }));
  // }

  // async findChildren(parent_id: string): Promise<FaqResponseDto[]> {
  //   const faqs = await this.faqRepository.find({
  //     where: { parent: { faq_id: parent_id } },
  //     relations: ['children'],
  //   });
  //   return faqs.map(faq => plainToClass(FaqResponseDto, faq, { excludeExtraneousValues: true }));
  // }
}
