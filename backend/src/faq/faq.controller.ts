import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqResponseDto } from './dto/faq-response.dto';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqQueryDto } from './dto/faq-query.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';


import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('faqs')
@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new FAQ' })
  @ApiResponse({ status: 201, description: 'FAQ created successfully', type: FaqResponseDto })
  async create(@Body() createFaqDto: CreateFaqDto): Promise<FaqResponseDto> {
    return this.faqService.create(createFaqDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all FAQs with search and pagination' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for FAQ content' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of FAQs' })
  async findAll(@Query() query: FaqQueryDto): Promise<PaginatedData<FaqResponseDto>> {
    return this.faqService.searchAndPaginate(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get FAQ by ID' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiResponse({ status: 200, description: 'FAQ found', type: FaqResponseDto })
  async findOne(@Param('id') id: string): Promise<FaqResponseDto> {
    return this.faqService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update FAQ by ID' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiResponse({ status: 200, description: 'FAQ updated successfully', type: FaqResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateFaqDto: UpdateFaqDto,
  ): Promise<FaqResponseDto> {
    return this.faqService.update(id, updateFaqDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete FAQ by ID' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiResponse({ status: 204, description: 'FAQ deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.faqService.remove(id);
  }
}

