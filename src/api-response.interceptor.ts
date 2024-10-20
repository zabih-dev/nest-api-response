import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RESPONSE_TYPE, STANDARD_RESPONSE_TYPE_KEY } from './constants';
import { ApiResponseDto } from './dto';
import { ApiExceptionFilter } from './api.exception';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  private routeController: Type<any>;
  private routeHandler;

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.routeController = context.getClass();
    this.routeHandler = context.getHandler();

    const responseType = this.reflector?.getAllAndOverride(
      STANDARD_RESPONSE_TYPE_KEY,
      [this.routeHandler, this.routeController],
    );

    if (responseType === RESPONSE_TYPE.RAW) {
      return next.handle();
    }

    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return new ApiResponseDto({
      success: true,
      statusCode,
      data: res,
    });
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const apiResponse = ApiExceptionFilter.handleException(exception, context);
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    response.status(apiResponse.statusCode).json(apiResponse);
  }
}
