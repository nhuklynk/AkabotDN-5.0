import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { apiKeyConfig } from '../../config/api-key.config';

@Injectable()
export class GlobalJwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Check if route is marked as internal access (API key)
    const isInternalAccess = this.reflector.getAllAndOverride<boolean>('internalAccess', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isInternalAccess) {
      return this.validateApiKey(context);
    }

    // Apply JWT authentication for protected routes
    const result = await super.canActivate(context);
    return result as boolean;
  }

  private validateApiKey(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers[apiKeyConfig.headerName];

    if (!apiKey) {
      throw new UnauthorizedException(`${apiKeyConfig.headerName} header is required for internal access`);
    }

    // Validate API key
    if (apiKey !== apiKeyConfig.internalApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
