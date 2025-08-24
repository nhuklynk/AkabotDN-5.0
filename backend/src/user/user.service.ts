import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserStatus } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { CreateUserDto } from './dto/user/create-user.dto';
import { UpdateUserDto } from './dto/user/update-user.dto';
import { UserResponseDto } from './dto/user/user-response.dto';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Status } from '../config/base-audit.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if phone is provided and if it already exists
    if (createUserDto.phone) {
      const existingUserWithPhone = await this.userRepository.findOne({
        where: { phone: createUserDto.phone },
      });

      if (existingUserWithPhone) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
      status: (createUserDto.status as any) || Status.ACTIVE, // Use status from DTO or default to ACTIVE
      created_by: 'system',
      modified_by: 'system',
    });

    const savedUser = await this.userRepository.save(user);

    // Assign role if role_id is provided
    if (createUserDto.role_id) {
      const role = await this.roleRepository.findOne({
        where: { id: createUserDto.role_id }
      });
      
      if (!role) {
        throw new BadRequestException(`Role with ID ${createUserDto.role_id} not found`);
      }

      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(savedUser)
        .add(role);
    }

    // Return user with roles
    return this.findOne(savedUser.id);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['roles'],
      select: {
        id: true,
        email: true,
        full_name: true,
        created_at: true,
        avatar: true,
        phone: true,
        status: true,
        roles: {
          id: true,
          name: true
        }
      }
    });
    return users.map(user => plainToClass(UserResponseDto, user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['roles'],
      select: {
        id: true,
        email: true,
        full_name: true,
        created_at: true,
        avatar: true,
        phone: true,
        status: true,
        roles: {
          id: true,
          name: true
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return plainToClass(UserResponseDto, user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['roles'],
      select: {
        id: true,
        email: true,
        full_name: true,
        created_at: true,
        avatar: true,
        phone: true,
        status: true,
        roles: {
          id: true,
          name: true
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if phone is being updated and if it already exists
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUserWithPhone = await this.userRepository.findOne({
        where: { phone: updateUserDto.phone },
      });

      if (existingUserWithPhone) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    // Extract role_ids from updateUserDto and remove it from the DTO
    const { role_ids, ...updateData } = updateUserDto;

    // Update all user data including roles in one operation
    if (role_ids !== undefined) {
      // Find the roles by IDs
      const foundRoles = await this.roleRepository.findBy({ id: In(role_ids) });
      user.roles = foundRoles;
    }

    // Update all other fields
    Object.assign(user, updateData);

    // Save the complete updated user
    const savedUser = await this.userRepository.save(user);

    // Fetch the updated user with roles for response
    const updatedUser = await this.userRepository.findOne({
      where: { id: id },
      relations: ['roles'],
      select: {
        id: true,
        email: true,
        full_name: true,
        created_at: true,
        avatar: true,
        phone: true,
        status: true,
        roles: {
          id: true,
          name: true
        }
      }
    });

    return plainToClass(UserResponseDto, updatedUser);
  }

  async remove(id: string): Promise<{ message: string}> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Soft delete: Change status to DELETED instead of hard delete
      user.status = Status.DELETED;
      await this.userRepository.save(user);

      return {
        message: 'User suspended successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException
      }
      
      // Handle other errors (database errors, etc.)
      throw new Error(`Failed to suspend user: ${error.message}`);
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }
}
