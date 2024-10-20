import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ApiResponseInterceptor } from './api-response.interceptor';
import { ApiValidationPipe } from './api-validation.pipe';
import { ApiExceptionFilter } from './api.exception';

// @ts-expect-error Fix the Bigint serialization issue
BigInt.prototype.toJSON = function () {
  return this.toString();
  // return { $bigint: this.toString() };
};

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ApiValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class ApiResponseModule {}
