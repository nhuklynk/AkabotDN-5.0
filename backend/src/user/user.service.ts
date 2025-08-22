import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, fullName, avatar, phone, roleIds } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = this.userRepository.create({
      email,
      passwordHash,
      fullName,
      avatar,
      phone,
    });

    // Assign roles if provided
    if (roleIds && roleIds.length > 0) {
      const roles = await this.roleRepository.findByIds(roleIds);
      user.roles = roles;
    }

    const savedUser = await this.userRepository.save(user);
    return this.toResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['roles'],
    });
    return users.map((user) => this.toResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['roles'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return this.toResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['roles'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { email, password, fullName, avatar, phone, roleIds } = updateUserDto;

    // Check for conflicts if email is being updated
    if (email && email !== user.email) {
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update fields
    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;

    // Hash password if provided
    if (password) {
      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    // Update roles if provided
    if (roleIds !== undefined) {
      if (roleIds.length > 0) {
        const roles = await this.roleRepository.findByIds(roleIds);
        user.roles = roles;
      } else {
        user.roles = [];
      }
    }

    const updatedUser = await this.userRepository.save(user);
    return this.toResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userRepository.findOne({
      where: { userId: id },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  private toResponseDto(user: User): UserResponseDto {
    return new UserResponseDto({
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      phone: user.phone,
      status: user.status,
      roles: user.roles?.map(role => ({
        roleId: role.roleId,
        roleName: role.roleName,
        description: role.description,
      })) || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
