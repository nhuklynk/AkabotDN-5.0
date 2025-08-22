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
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(registerDto);
    
    // Set cookies for frontend
    this.setAuthCookies(res, result.access_token, result.refresh_token);
    
    // Return full response with tokens for Postman testing
    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    
    // Set cookies for frontend
    this.setAuthCookies(res, result.access_token, result.refresh_token);
    
    // Return full response with tokens for Postman testing
    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<AuthResponseDto> {
    // Try to get refresh token from cookies first
    let refreshToken = req.cookies?.refresh_token;
    
    // If not in cookies, try from request body (for Postman)
    if (!refreshToken && req.body?.refresh_token) {
      refreshToken = req.body.refresh_token;
    }
    
    if (!refreshToken) {
      throw new Error('Refresh token not found in cookies or request body');
    }
    
    const result = await this.authService.refresh({ refresh_token: refreshToken });
    
    // Set new cookies for frontend
    this.setAuthCookies(res, result.access_token, result.refresh_token);
    
    // Return full response with tokens for Postman testing
    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: ExpressResponse): Promise<{ message: string }> {
    // Clear cookies
    this.clearAuthCookies(res);
    
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  async getProfile(@Request() req): Promise<any> {
    return this.authService.getProfile(req.user.id);
  }

  private setAuthCookies(res: ExpressResponse, accessToken: string, refreshToken: string): void {
    // Access token cookie (short-lived, HTTP-only)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Refresh token cookie (longer-lived, HTTP-only)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  private clearAuthCookies(res: ExpressResponse): void {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
  }
}
