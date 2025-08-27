import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const authHeader = request?.headers?.authorization;
          
          if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            return token;
          }
          this.logger.log(`JWT Strategy - No token in Authorization header`);
          return null;
        },
        (request) => {
          const allowCookieAuth = String(request?.headers?.['x-use-cookie-auth'] || '').toLowerCase() === 'true';
          
          if (!allowCookieAuth) {
            this.logger.log(`JWT Strategy - Cookie auth not allowed`);
            return null;
          }
          
          const cookieToken = request?.cookies?.access_token;
          this.logger.log(`JWT Strategy - Cookie token:`, cookieToken ? `${cookieToken.substring(0, 20)}...` : 'null');
          return cookieToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: JwtPayloadDto) {
    this.logger.log(`JWT Strategy - validate() called`);
    this.logger.log(`JWT Strategy - Request headers:`, request?.headers);
    this.logger.log(`JWT Strategy - Request cookies:`, request?.cookies);
    this.logger.log(`JWT Strategy - Payload received:`, payload);
    
    try {
      if (!payload.sub || !payload.email) {
        this.logger.error(`JWT Strategy - Invalid payload: missing sub or email`);
        throw new UnauthorizedException('Invalid token payload');
      }

      if (payload.type !== 'access') {
        this.logger.error(`JWT Strategy - Invalid token type: ${payload.type}`);
        throw new UnauthorizedException('Invalid token type');
      }

      this.logger.log(`JWT Strategy - Token validated for user: ${payload.email}`);
      
      const userData = {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
        role: payload.role || 'unknown',
      };
      
      this.logger.log(`JWT Strategy - Returning user data:`, userData);
      return userData;
    } catch (error) {
      this.logger.error(`JWT Strategy - Error in validate():`, error.message);
      throw error;
    }
  }
}
