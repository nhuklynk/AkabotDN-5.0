import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike, Not } from 'typeorm';
import { ExecutiveBoard } from './entity/executive-board.entity';
import { CreateExecutiveBoardDto } from './dto/create-executive-board.dto';
import { UpdateExecutiveBoardDto } from './dto/update-executive-board.dto';
import { ExecutiveBoardResponseDto } from './dto/executive-board-response.dto';
import { ExecutiveBoardQueryDto } from './dto/executive-board-query.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ExecutiveBoardService {
  constructor(
    @InjectRepository(ExecutiveBoard)
    private executiveBoardRepository: Repository<ExecutiveBoard>,
  ) {}



  async findAll(query: ExecutiveBoardQueryDto): Promise<ExecutiveBoardResponseDto[]> {
    const queryBuilder = this.executiveBoardRepository.createQueryBuilder('executive_board');

    if (query.search) {
      queryBuilder.andWhere(
        '(executive_board.unit ILIKE :search OR executive_board.professional_expertise ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.position_title) {
      queryBuilder.andWhere('executive_board.position_title = :position_title', { 
        position_title: query.position_title 
      });
    }

    if (query.is_active !== undefined) {
      queryBuilder.andWhere('executive_board.is_active = :is_active', { 
        is_active: query.is_active 
      });
    }

    // Sort by creation date (newest first)
    queryBuilder.orderBy('executive_board.created_at', 'DESC');

    const executiveBoards = await queryBuilder.getMany();
    return executiveBoards.map(executiveBoard => 
      plainToClass(ExecutiveBoardResponseDto, executiveBoard)
    );
  }

  async findOne(id: string): Promise<ExecutiveBoardResponseDto> {
    const executiveBoard = await this.executiveBoardRepository.findOne({
      where: { id }
    });

    if (!executiveBoard) {
      throw new NotFoundException(`Executive board with ID ${id} not found`);
    }

    return plainToClass(ExecutiveBoardResponseDto, executiveBoard);
  }

  async update(id: string, updateExecutiveBoardDto: UpdateExecutiveBoardDto): Promise<ExecutiveBoardResponseDto> {
    const executiveBoard = await this.executiveBoardRepository.findOne({
      where: { id }
    });

    if (!executiveBoard) {
      throw new NotFoundException(`Executive board with ID ${id} not found`);
    }

    Object.assign(executiveBoard, updateExecutiveBoardDto);
    executiveBoard.modified_by = 'system';

    const updatedExecutiveBoard = await this.executiveBoardRepository.save(executiveBoard);
    return plainToClass(ExecutiveBoardResponseDto, updatedExecutiveBoard);
  }

  async remove(id: string): Promise<{ message: string }> {
    const executiveBoard = await this.executiveBoardRepository.findOne({
      where: { id }
    });

    if (!executiveBoard) {
      throw new NotFoundException(`Executive board member with ID ${id} not found`);
    }

    // Hard delete - remove completely from database
    await this.executiveBoardRepository.remove(executiveBoard);

    return {
      message: 'Executive board member deleted permanently'
    };
  }

  async findByPosition(positionTitle: string): Promise<ExecutiveBoardResponseDto[]> {
    const executiveBoards = await this.executiveBoardRepository.find({
      where: { 
        position_title: positionTitle,
        is_active: true
      },
      order: { created_at: 'ASC' }
    });

    return executiveBoards.map(executiveBoard => 
      plainToClass(ExecutiveBoardResponseDto, executiveBoard)
    );
  }



  async create(createExecutiveBoardDto: CreateExecutiveBoardDto): Promise<ExecutiveBoardResponseDto> {
    const executiveBoard = this.executiveBoardRepository.create(createExecutiveBoardDto);
    executiveBoard.created_by = 'system';
    executiveBoard.modified_by = 'system';

    const savedExecutiveBoard = await this.executiveBoardRepository.save(executiveBoard);
    return plainToClass(ExecutiveBoardResponseDto, savedExecutiveBoard);
  }
}
