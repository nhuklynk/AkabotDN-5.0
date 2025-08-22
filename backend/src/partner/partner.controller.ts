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
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerResponseDto } from './dto/partner-response.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';


import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('partners')
@ApiTags('Partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPartnerDto: CreatePartnerDto): Promise<PartnerResponseDto> {
    return this.partnerService.create(createPartnerDto);
  }

  @Get()
  async findAll(): Promise<PartnerResponseDto[]> {
    return this.partnerService.findAll();
  }

  // @Get('active')
  // async findActivePartners(): Promise<PartnerResponseDto[]> {
  //   return this.partnerService.findActivePartners();
  // }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PartnerResponseDto> {
    return this.partnerService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<PartnerResponseDto> {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.partnerService.remove(id);
  }
}

