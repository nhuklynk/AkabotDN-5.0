import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  Response,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto, AuthResponseDto } from './dto';
import { Public } from './decorators/public.decorator';
import type { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    const result = await this.authService.register(registerDto);
    
    const refreshToken = await this.authService.generateRefreshTokenForUser(registerDto.email);
    this.setAuthCookies(res, result.access_token, refreshToken);
    
    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    const result = await this.authService.login(loginDto);
    
    const refreshToken = await this.authService.generateRefreshTokenForUser(loginDto.email);
    this.setAuthCookies(res, result.access_token, refreshToken);
    
    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    let refreshToken = req.cookies?.refresh_token;
    
    if (!refreshToken && req.body?.refresh_token) {
      refreshToken = req.body.refresh_token;
    }
    
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    
    const result = await this.authService.refresh({ refresh_token: refreshToken });
    
    const newRefreshToken = await this.authService.generateRefreshTokenForUser(result.user.email);
    this.setAuthCookies(res, result.access_token, newRefreshToken);
    
    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: ExpressResponse): Promise<{ message: string }> {
    this.clearAuthCookies(res);
    
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  async getProfile(@Request() req): Promise<any> {
    return this.authService.getProfile(req.user.id);
  }

  private setAuthCookies(res: ExpressResponse, accessToken: string, refreshToken: string): void {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  private clearAuthCookies(res: ExpressResponse): void {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
  }
}
