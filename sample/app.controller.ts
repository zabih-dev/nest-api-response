import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthDto } from './dto';
import { RawResponse } from '../src';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('unauthorized')
  testUnauthorized() {
    throw new UnauthorizedException();
  }

  // will be wrapped by the api response
  @Get('users')
  getUsers() {
    return [
      { id: 1, name: 'John' },
      { id: 2, name: 'Petter' },
    ];
  }

  @RawResponse() // add it to skip the response wrapper
  @Get('users-raw')
  getUsersRaw() {
    return [
      { id: 1, name: 'John' },
      { id: 2, name: 'Petter' },
    ];
  }

  @Post('test-validations')
  testValidations(@Body() dto: AuthDto) {
    return dto;
  }
}
