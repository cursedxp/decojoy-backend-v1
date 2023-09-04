import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from 'paypal-rest-sdk';

@Injectable()
export class PaypalService {
  constructor(private configService: ConfigService) {
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
        const execute_payment_json = {
          payer_id: payerId,
          transactions: [
            {
              amount: {
                currency: 'USD',
                total: 'your_amount', // Replace with the amount
              },
            },
          ],
        };

        paypal.payment.execute(
          paymentId,
          execute_payment_json,
          function (error, payment) {
            if (error) {
              reject(error);
            } else {
              resolve(payment);
            }
          },
        );
      });
    } catch (error) {
      throw new Error(`Payment execution failed: ${error.message}`);
    }
  }
}
