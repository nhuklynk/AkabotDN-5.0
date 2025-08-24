import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entity/role.entity';
import { CreateRoleDto } from './dto/role/create-role.dto';
import { UpdateRoleDto } from './dto/role/update-role.dto';
import { RoleResponseDto } from './dto/role/role-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    // Check if role with name already exists
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    const savedRole = await this.roleRepository.save(role);
    return plainToClass(RoleResponseDto, savedRole, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find();
    return roles.map(role => plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true }));
  }

  async findOne(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id: id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true });
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name: name },
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id: id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Check if role name is being updated and if it already exists
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    await this.roleRepository.update(id, updateRoleDto);
    const updatedRole = await this.roleRepository.findOne({
      where: { id: id },
    });

    return plainToClass(RoleResponseDto, updatedRole, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    await this.roleRepository.remove(role);
  }
}
