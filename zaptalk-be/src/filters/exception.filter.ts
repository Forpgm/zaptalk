import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

interface ExceptionResponse {
  statusCode?: number;
  message?: string | string[];
  errors?: any;
  [key: string]: any;
}
export interface ValidationError {
  path: string;
  message: string;
}
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = '';
    let errors: ValidationError[] = [];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const resObj = exceptionResponse as ExceptionResponse;
      if (typeof resObj.message === 'string') {
        message = resObj.message;
      }
      errors = Array.isArray(resObj.errors)
        ? (resObj.errors as ValidationError[])
        : [];

      response.status(status).json({
        statusCode: status,
        message,
        errors,
      });
    }
  }
}
