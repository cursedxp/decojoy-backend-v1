import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';

@Module({
  imports: [JwtModule],
  controllers: [AdminController],
})
export class AdminModule {}
