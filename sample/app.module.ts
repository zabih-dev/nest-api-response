import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiResponseModule } from '../src';

@Module({
  imports: [ApiResponseModule], // Add this line
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
