import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from 'paypal-rest-sdk';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaypalService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    paypal.configure({
      mode: this.configService.get<string>('PAYPAL_MODE'),
      client_id: this.configService.get<string>('PAYPAL_CLIENT_ID'),
      client_secret: this.configService.get<string>('PAYPAL_CLIENT_SECRET'),
    });
  }
  async createPayment(amount: number): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const create_payment_json = {
          intent: 'sale',
          payer: {
            payment_method: 'paypal',
          },
          redirect_urls: {
            return_url: 'http://return.url', // You'll replace this with your frontend return URL
            cancel_url: 'http://cancel.url', // And this with your cancel URL
          },
          transactions: [
            {
              amount: {
                currency: 'USD',
                total: amount.toString(),
              },
              description: 'This is the payment description.',
            },
          ],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            console.error(
              'PayPal Error during payment creation:',
              error.response ? error.response : error,
            );
            reject(error);
          } else {
            resolve(payment);
          }
        });
      });
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  async executePayment(paymentId: string, payerId: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        paypal.payment.get(paymentId, async (error, payment) => {
          if (error) {
            console.error(
              'PayPal Error during payment retrieval:',
              error.response ? error.response : error,
            );
            reject(error);
            return;
          }

          const execute_payment_json = {
            payer_id: payerId,
            transactions: [
              {
                amount: payment.transactions[0].amount,
              },
            ],
          };

          paypal.payment.execute(
            paymentId,
            execute_payment_json,
            async (error, executedPayment) => {
              if (error) {
                console.error(
                  'PayPal Error during payment execution:',
                  error.response ? error.response : error,
                );
                reject(error);
              } else {
                // Save the transaction details to the database
                await this.saveTransactionDetails(executedPayment);
                resolve(executedPayment);
              }
            },
          );
        });
      });
    } catch (error) {
      throw new Error(`Payment execution failed: ${error.message}`);
    }
  }

  async saveTransactionDetails(paymentResponse: any) {
    const { id, state, payer, transactions } = paymentResponse;

    try {
      const transaction = this.prismaService.transaction.create({
        data: {
          paymentId: id,
          payerId: payer.payer_info.payer_id,
          state: state,
          amount: parseFloat(transactions[0].amount.total),
          currency: transactions[0].amount.currency,
          description: transactions[0].description,
          paymentMethod: payer.payment_method,
          payerEmail: payer.payer_info.email,
          payerFirstName: payer.payer_info.first_name,
          payerLastName: payer.payer_info.last_name,
        },
      });
      return transaction;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
  private handlePrismaError(error: any) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Unique constraint violation.');
      case 'P2016':
        throw new NotFoundException('Record not found.');
      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed.');
      case 'P2001':
      default:
        throw new InternalServerErrorException(
          'An internal server error occurred.',
        );
    }
  }
}
