import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CloudStorageService } from 'src/cloud-storage/cloudStorage.service';

@Module({
  imports: [JwtModule],
  controllers: [AdminController],
  providers: [AdminService, CloudStorageService],
})
export class AdminModule {}
