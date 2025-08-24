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
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerResponseDto } from './dto/partner-response.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerQueryDto } from './dto/partner-query.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('partners')
@ApiTags('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiResponse({ status: 201, description: 'Partner created successfully', type: PartnerResponseDto })
  async create(@Body() createPartnerDto: CreatePartnerDto): Promise<PartnerResponseDto> {
    return this.partnerService.create(createPartnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all partners with search and pagination' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for partner name or description' })
  @ApiQuery({ name: 'partner_type', required: false, description: 'Filter by partner type', enum: ['strategic', 'gold', 'silver', 'bronze', 'associate'] })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of partners' })
  async findAll(@Query() query: PartnerQueryDto): Promise<PaginatedData<PartnerResponseDto>> {
    return this.partnerService.searchAndPaginate(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 200, description: 'Partner found', type: PartnerResponseDto })
  async findOne(@Param('id') id: string): Promise<PartnerResponseDto> {
    return this.partnerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 200, description: 'Partner updated successfully', type: PartnerResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<PartnerResponseDto> {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 204, description: 'Partner deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.partnerService.remove(id);
  }
}

