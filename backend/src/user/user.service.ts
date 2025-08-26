import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entity/user.entity';
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

    // Validate role_id is provided
    if (!createUserDto.role_id) {
      throw new BadRequestException('Role ID is required when creating a user');
    }

    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.role_id }
    });
    
    if (!role) {
      throw new BadRequestException(`Role with ID ${createUserDto.role_id} not found`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
      status: (createUserDto.status as any) || Status.ACTIVE,
      created_by: 'system',
      modified_by: 'system',
      roles: [role], // Gán role trực tiếp vào user
    });

    const savedUser = await this.userRepository.save(user);

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
        password_hash: true,
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

    // Update all other fields (excluding role_ids since we handled it separately)
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
      user.status = Status.INACTIVE;
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
    if (!user.password_hash) {
      return false;
    }
    return bcrypt.compare(password, user.password_hash);
  }

  
  async findByRole(roleId: string): Promise<UserResponseDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('role.id = :roleId', { roleId })
      .select([
        'user.id',
        'user.email',
        'user.full_name',
        'user.created_at',
        'user.avatar',
        'user.phone',
        'user.status',
        'role.id',
        'role.name',
      ])
      .getMany();

    return users.map(user => plainToClass(UserResponseDto, user));
  }
}
