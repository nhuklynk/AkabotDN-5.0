import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class JwtRefreshInterceptor implements NestInterceptor {
  private readonly logger = new Logger(JwtRefreshInterceptor.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.status === 401 && error.message === 'jwt expired') {
          return this.handleTokenExpired(context, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private async handleTokenExpired(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    try {
      const refreshToken = request.cookies?.refresh_token;
      
      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token available');
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConfig.secret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token type');
      }

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new UnauthorizedException('Refresh token expired');
      }

      this.logger.log(`Refreshing tokens for user: ${payload.email}`);
      const authResult = await this.authService.refresh({ refresh_token: refreshToken });

      this.setNewAuthCookies(response, authResult.access_token, refreshToken);
      request.headers.authorization = `Bearer ${authResult.access_token}`;
      
      return next.handle();

    } catch (refreshError) {
      this.logger.error(`Token refresh failed: ${refreshError.message}`);
      
      this.clearAuthCookies(response);
      
      throw new UnauthorizedException('Token refresh failed, please login again');
    }
  }

  private setNewAuthCookies(res: any, accessToken: string, refreshToken: string): void {
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

  private clearAuthCookies(res: any): void {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
  }
}
