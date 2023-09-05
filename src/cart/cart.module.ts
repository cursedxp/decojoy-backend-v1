import { Module, forwardRef } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PaypalModule } from 'src/paypal/paypal.module';

@Module({
  imports: [forwardRef(() => PaypalModule)],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
