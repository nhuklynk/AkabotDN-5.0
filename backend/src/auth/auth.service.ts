import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { User } from '../user/entity/user.entity';
import { jwtConfig } from '../config/jwt.config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    try {
      const userResponse = await this.userService.create(registerDto);
      const user = await this.userService.findOne(userResponse.id);
      
      if (!user) {
        throw new NotFoundException('User not found after registration');
      }
      
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      this.logger.log(`User registered: ${userResponse.email}`);

      return {
        access_token: accessToken,
        user: {
          id: userResponse.id,
          username: userResponse.full_name,
          email: userResponse.email,
          role: userResponse.roles?.[0]?.name || 'user',
        },
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      this.logger.log(`User logged in: ${user.email}`);

      return {
        access_token: accessToken,
        user: {
          id: user.id,
          username: user.full_name,
          email: user.email,
          role: user.roles?.[0]?.name || 'user',
        },
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    try {
      const { refresh_token } = refreshTokenDto;

      const payload = this.jwtService.verify(refresh_token, {
        secret: jwtConfig.secret,
      }) as JwtPayloadDto;

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userService.findOne(payload.sub);
      
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      this.logger.log(`Tokens refreshed for user: ${user.email}`);

      return {
        access_token: newAccessToken,
        user: {
          id: user.id,
          username: user.full_name,
          email: user.email,
          role: user.roles?.[0]?.name || 'user',
        },
      };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userService.findByEmail(email);
      
      if (!user) {
        return null;
      }

      const isPasswordValid = await this.userService.validatePassword(user, password);
      
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`User validation failed: ${error.message}`);
      return null;
    }
  }

  async getProfile(userId: string): Promise<any> {
    try {
      const user = await this.userService.findOne(userId);
      return {
        id: user.id,
        username: user.full_name,
        email: user.email,
        role: user.roles?.[0]?.name || 'user',
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      this.logger.error(`Get profile failed: ${error.message}`);
      throw error;
    }
  }

  async generateRefreshTokenForUser(email: string): Promise<string> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.generateRefreshToken(user);
    } catch (error) {
      this.logger.error(`Failed to generate refresh token: ${error.message}`);
      throw error;
    }
  }

  private generateAccessToken(user: User | any): string {
    const payload: JwtPayloadDto = {
      sub: user.id,
      email: user.email,
      username: user.full_name,
      role: user.roles?.[0]?.name || 'user',
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      expiresIn: jwtConfig.accessTokenExpiresIn,
    });
  }

  private generateRefreshToken(user: User | any): string {
    const payload: JwtPayloadDto = {
      sub: user.id,
      email: user.email,
      username: user.full_name,
      role: user.roles?.[0]?.name || 'user',
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      expiresIn: jwtConfig.refreshTokenExpiresIn,
    });
  }
}
