import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty()
  field: string;

  @ApiProperty()
  messages: string[];
}

export class ApiResponseDto<TData = any> {
  @ApiProperty()
  readonly success: boolean = true;

  @ApiProperty()
  readonly statusCode: number;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  errors?: ValidationErrorDto[];

  @ApiProperty()
  data: TData | TData[];

  constructor({
    success,
    statusCode,
    message,
    errors,
    data,
  }: ApiResponseDto<TData>) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = data;
    this.data = data;
  }
}
