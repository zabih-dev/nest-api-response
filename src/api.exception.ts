import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from './dto';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (!exception) return;
    const apiResponse = ApiExceptionFilter.handleException(exception, host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(apiResponse.statusCode).json(apiResponse);
  }

  static handleException(
    exception: HttpException,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    host: ArgumentsHost,
  ): ApiResponseDto {
    // @ts-expect-error check the exception code if exists
    const prismaStatusCode = exception.code == 'P2025' ? 404 : null;
    const statusCode =
      prismaStatusCode ??
      (exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR);

    const message = exception.message ?? null;

    let responseDto: ApiResponseDto = {
      success: false,
      statusCode,
      message,
      errors: null,
      data: null,
    };

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    if (typeof exceptionResponse === 'object') {
      responseDto = {
        ...responseDto,
        ...exceptionResponse,
        success: false,
      };
    }

    return new ApiResponseDto({ ...responseDto });
  }
}
