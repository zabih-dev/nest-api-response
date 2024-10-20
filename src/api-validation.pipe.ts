import {
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

@Injectable()
export class ApiValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    options = options || {};
    options.whitelist = true;
    options.exceptionFactory = (errors: ValidationError[] = []) => {
      const formattedErrors = errors.map((error) => ({
        field: error.property,
        messages: Object.values(error.constraints ?? []),
      }));
      return new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: formattedErrors,
        errorType: 'ValidationError',
      });
    };
    super(options);
  }
}
