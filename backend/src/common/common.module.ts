import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ApiResponseInterceptor } from './interceptors/api-response.interceptor';
import { ApiExceptionFilter } from './filters/api-exception.filter';
import { PaginationService } from './services/pagination.service';

@Module({
  providers: [
    ApiResponseInterceptor,
    ApiExceptionFilter,
    PaginationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
  exports: [PaginationService],
})
export class CommonModule {}
