import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Catch(JsonWebTokenError, TokenExpiredError)
export class JwtErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(JwtErrorFilter.name);

  catch(exception: JsonWebTokenError | TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.UNAUTHORIZED;
    let message = 'Invalid token';

    if (exception instanceof TokenExpiredError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'jwt expired';
      this.logger.warn(`JWT expired: ${request.url}`);
    } else if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'jwt malformed';
      this.logger.warn(`JWT malformed: ${request.url}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
