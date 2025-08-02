export interface SuccessResponse<Data> {
  statusCode: number;
  message: string;
  data: Data;
}

export interface ValidationError<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  field: keyof T | string;
  message: string;
}

// export interface ErrorResponse<
//   T extends Record<string, unknown> = Record<string, unknown>
// > {
//   statusCode: number;
//   message: string;
//   errors?: ValidationError<T>[] | string[];
// }

export interface ErrorResponse<Data> {
  statusCode: number;
  message: string;
  errors: Data;
}
