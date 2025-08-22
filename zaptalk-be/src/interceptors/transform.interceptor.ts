import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const statusCode = res.statusCode;

    return next.handle().pipe(
      map((response: T) => {
        let message: string = '';
        let data = response;

        message = (response as ApiResponse<T>).message;
        data = (response as ApiResponse<T>).data;
        console.log(message, data);
        return {
          statusCode,
          message,
          data,
        };
      }),
    );
  }
}
