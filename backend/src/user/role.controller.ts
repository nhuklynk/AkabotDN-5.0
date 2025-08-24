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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/role/create-role.dto';
import { UpdateRoleDto } from './dto/role/update-role.dto';
import { RoleResponseDto } from './dto/role/role-response.dto';


import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(id);
  }
}

