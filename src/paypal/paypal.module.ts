import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import this
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
