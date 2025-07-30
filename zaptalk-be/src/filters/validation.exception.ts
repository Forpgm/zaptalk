import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { VALIDATION_FAILED } from 'src/constants/messages';

export class ValidationException extends UnprocessableEntityException {
  constructor(errors: { field: string; message: string }[]) {
    super({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: VALIDATION_FAILED,
      errors,
    });
  }
}
