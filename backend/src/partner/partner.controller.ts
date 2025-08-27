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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PartnerService } from './partner.service';
import { CreatePartnerFormDataDto } from './dto/create-partner-formdata.dto';
import { PartnerResponseDto } from './dto/partner-response.dto';
import { UpdatePartnerFormDataDto } from './dto/update-partner-formdata.dto';
import { PartnerQueryDto } from './dto/partner-query.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';

@Controller('partners')
@ApiTags('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('form-data')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ 
    summary: 'Create a new partner with form data and file upload',
    description: 'Create a new partner using form data. Supports logo file upload along with other partner details.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Partner information with optional logo file upload',
    type: CreatePartnerFormDataDto,
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Partner created successfully with uploaded logo', 
    type: PartnerResponseDto 
  })
  async createWithFormData(
    @Body() createPartnerFormDataDto: CreatePartnerFormDataDto,
    @UploadedFile() logo?: Express.Multer.File,
  ): Promise<PartnerResponseDto> {
    return this.partnerService.createWithFormData(createPartnerFormDataDto, logo);
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
    @Body() updatePartnerDto: UpdatePartnerFormDataDto,
  ): Promise<PartnerResponseDto> {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Patch(':id/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ 
    summary: 'Update partner with form data and optional file upload',
    description: 'Update an existing partner using form data. Supports logo file upload along with other partner details.'
  })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Partner information to update with optional logo file upload',
    type: UpdatePartnerFormDataDto,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Partner updated successfully with optional new logo', 
    type: PartnerResponseDto 
  })
  async updateWithFormData(
    @Param('id') id: string,
    @Body() updatePartnerFormDataDto: UpdatePartnerFormDataDto,
    @UploadedFile() logo?: Express.Multer.File,
  ): Promise<PartnerResponseDto> {
    return this.partnerService.updateWithFormData(id, updatePartnerFormDataDto, logo);
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

