import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { apiKeyConfig } from '../../config/api-key.config';

@Injectable()
export class GlobalJwtAuthGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  private readonly logger = new Logger(GlobalJwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const route = `${request.method} ${request.url}`;

    this.logger.log(`GlobalJwtAuthGuard checking route: ${route}`);

    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.log(`Route ${route} is public, allowing access`);
      return true;
    }

    // Check if route is marked as internal access (API key)
    const isInternalAccess = this.reflector.getAllAndOverride<boolean>(
      'internalAccess',
      [context.getHandler(), context.getClass()],
    );

    if (isInternalAccess) {
      this.logger.log(`Route ${route} requires internal access`);
      return this.validateApiKey(context);
    }

    // Apply JWT authentication for protected routes
    this.logger.log(`Route ${route} requires JWT authentication`);

    // Check if token exists before calling JWT strategy
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      this.logger.error(`Route ${route}: No token found`);
      throw new UnauthorizedException('Access token is required');
    }

    this.logger.log(`Route ${route}: Token found, length: ${token.length}`);
    const result = await super.canActivate(context);

    const currentRequest = context.switchToHttp().getRequest();

    return result as boolean;
  }

  private validateApiKey(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers[apiKeyConfig.headerName];

    if (!apiKey) {
      throw new UnauthorizedException(
        `${apiKeyConfig.headerName} header is required for internal access`,
      );
    }

    // Validate API key
    if (apiKey !== apiKeyConfig.internalApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  private extractTokenFromRequest(request: any): string | null {
    // Try to get token from cookies first
    const cookieToken = request?.cookies?.access_token;
    if (cookieToken) {
      return cookieToken;
    }

    // Try to get token from Authorization header
    const authHeader = request?.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}
