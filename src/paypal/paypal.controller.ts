import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CartService } from 'src/cart/cart.service';

@Controller('payment')
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private cartService: CartService,
  ) {}

  @Post('create')
  async createPayment(@Body('amount') amount: number) {
    try {
      const payment = await this.paypalService.createPayment(amount);

      const approvalUrl = payment.links.find(
        (link) => link.rel === 'approval_url',
      );

      if (approvalUrl) {
        return { url: approvalUrl.href };
      } else {
        throw new Error('Approval URL not found.');
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // In your PaypalController
  @Get('execute')
  async executePayment(
    @Query('paymentId') paymentId: string,
    @Query('PayerID') payerId: string,
  ) {
    try {
      const executedPayment = await this.paypalService.executePayment(
        paymentId,
        payerId,
      );

      // Assuming the payer's userId is available in the payment response or via other means
      const userId = executedPayment.payer.payer_info.payer_id;

      // Add purchased concepts to the user
      await this.cartService.addPurchasedConceptsToUser(userId);

      // Optionally, clear the cart
      await this.cartService.clearCart(userId);

      return executedPayment;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
