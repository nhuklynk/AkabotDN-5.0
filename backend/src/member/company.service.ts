import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entity/company.entity';
import { CreateCompanyDto } from './dto/company/create-company.dto';
import { UpdateCompanyDto } from './dto/company/update-company.dto';
import { CompanySimpleResponseDto } from './dto/company/company-simple-response.dto';
import { CompanyResponseDto } from './dto/company/company-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanySimpleResponseDto> {
    // Check if company with name already exists
    const existingCompany = await this.companyRepository.findOne({
      where: { name: createCompanyDto.name },
    });

    if (existingCompany) {
      throw new ConflictException('Company with this name already exists');
    }

    const company = this.companyRepository.create(createCompanyDto);
    const savedCompany = await this.companyRepository.save(company);
    return this.findOne(savedCompany.id);
  }

  async findAll(): Promise<CompanySimpleResponseDto[]> {
    const companies = await this.companyRepository.find();
    return companies.map((company) =>
      plainToClass(CompanySimpleResponseDto, company, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { id: id },
      relations: ['members', 'members.user', 'members.company'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return plainToClass(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  async findByName(name: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { name: name },
      relations: ['members', 'members.user', 'members.company'],
    });

    if (!company) {
      throw new NotFoundException(`Company with name ${name} not found`);
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanySimpleResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { id: id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    // Check if name is being updated and if it already exists
    if (updateCompanyDto.name && updateCompanyDto.name !== company.name) {
      const existingCompany = await this.companyRepository.findOne({
        where: { name: updateCompanyDto.name },
      });

      if (existingCompany) {
        throw new ConflictException('Company with this name already exists');
      }
    }

    await this.companyRepository.update(id, updateCompanyDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { id: id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    await this.companyRepository.remove(company);
  }
}
