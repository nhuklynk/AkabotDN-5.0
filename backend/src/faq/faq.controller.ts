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
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqResponseDto } from './dto/faq-response.dto';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';


import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Faq') 
@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFaqDto: CreateFaqDto): Promise<FaqResponseDto> {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  async findAll(): Promise<FaqResponseDto[]> {
    return this.faqService.findAll();
  }

  // @Get('root')
  // async findRootFaqs(): Promise<FaqResponseDto[]> {
  //   return this.faqService.findRootFaqs();
  // }

  // @Get(':id/children')
  // async findChildren(@Param('id') id: string): Promise<FaqResponseDto[]> {
  //   return this.faqService.findChildren(id);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FaqResponseDto> {
    return this.faqService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFaqDto: UpdateFaqDto,
  ): Promise<FaqResponseDto> {
    return this.faqService.update(id, updateFaqDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.faqService.remove(id);
  }
}

