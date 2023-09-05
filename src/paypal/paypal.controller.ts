import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('payment')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

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

  @Get('execute')
  async executePayment(
    @Query('paymentId') paymentId: string,
    @Query('PayerID') payerId: string,
  ) {
    try {
      return await this.paypalService.executePayment(paymentId, payerId);
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
