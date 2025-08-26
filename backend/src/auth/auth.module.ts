import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { jwtConfig } from '../config/jwt.config';
import { JwtRefreshInterceptor } from './interceptors/jwt-refresh.interceptor';
import { JwtErrorFilter } from './filters/jwt-error.filter';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.accessTokenExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    LocalStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtRefreshInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: JwtErrorFilter,
    },
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}