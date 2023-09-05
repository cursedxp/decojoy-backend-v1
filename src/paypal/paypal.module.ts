import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [ConfigModule, forwardRef(() => CartModule)],
  controllers: [PaypalController],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaypalModule {}
