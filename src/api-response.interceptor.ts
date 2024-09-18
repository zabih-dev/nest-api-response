import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RESPONSE_TYPE, STANDARD_RESPONSE_TYPE_KEY } from './constants';
import { ApiResponseDto } from './dto';

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
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    let exResponse;
    try {
      exResponse = exception.getResponse();
    } catch {}
    const errors = exResponse?.errors ?? null;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json(
      new ApiResponseDto({
        success: false,
        statusCode,
        message: exception.message,
        errors: errors,
        data: null,
      }),
    );
  }
}
