import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map(data => {
        // Check if data is already in pagination format
        if (data && typeof data === 'object' && 'items' in data && 'total' in data && 'page' in data && 'limit' in data && 'totalPages' in data) {
          // Data is already paginated, return as is
          return {
            success: true,
            statusCode: response.statusCode,
            message: this.getSuccessMessage(response.statusCode),
            data: data,
            errors: null,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }
        
        // Regular data, format normally
        return {
          success: true,
          statusCode: response.statusCode,
          message: this.getSuccessMessage(response.statusCode),
          data: data,
          errors: null,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }

  private getSuccessMessage(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Request processed successfully';
      case 201:
        return 'Resource created successfully';
      case 204:
        return 'Resource deleted successfully';
      default:
        return 'Request processed successfully';
    }
  }
}
