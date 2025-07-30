import {
  PipeTransform,
  ArgumentMetadata,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { VALIDATION_FAILED } from 'src/constants/messages';
import { ZodSchema } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown, metadata: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: VALIDATION_FAILED,
        errors,
      });
    }

    return result.data;
  }
}
