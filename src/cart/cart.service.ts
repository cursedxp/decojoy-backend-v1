import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaypalService } from 'src/paypal/paypal.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private paypalService: PaypalService,
  ) {}
  async findOrCreateCart(userId: string): Promise<any> {
    try {
      let cart = await this.prismaService.cart.findUnique({
        where: { userAuth0Id: userId },
      });
      if (!cart) {
        cart = await this.prismaService.cart.create({
          data: { userAuth0Id: userId },
        });
      }
      return cart;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
  async addToCart(userId: string, conceptId: string): Promise<any> {
    try {
      const cart = await this.findOrCreateCart(userId);
      return this.prismaService.cartItem.create({
        data: {
          cartId: cart.id,
          conceptId,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    try {
      const cartItem = await this.prismaService.cartItem.findUnique({
        where: { id: cartItemId },
      });
      if (!cartItem) {
        throw new NotFoundException('Cart item not found.');
      }
      await this.prismaService.cartItem.delete({
        where: { id: cartItemId },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getUserCart(userId: string): Promise<any> {
    try {
      const cart = this.prismaService.cart.findUnique({
        where: { userAuth0Id: userId },
        include: {
          cartItems: {
            include: {
              concept: true,
            },
          },
        },
      });
      if (!cart) {
        throw new NotFoundException('No cart found for the user.');
      }
      return cart;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
  async calculateCartTotal(userId: string): Promise<number> {
    const cart = await this.getUserCart(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    return cart.cartItems.reduce(
      (total, item) => total + item.concept.price,
      0,
    );
  }

  async addPurchasedConceptsToUser(userId: string): Promise<void> {
    const cart = await this.getUserCart(userId);

    if (!cart || !cart.cartItems.length) {
      throw new NotFoundException('Cart not found or cart is empty.');
    }

    // Extract all conceptIds from the cart items
    const conceptIds = cart.cartItems.map((item) => item.conceptId);

    // Update user's purchasedConcepts relation
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        purchasedConcepts: {
          connect: conceptIds.map((conceptId) => ({ id: conceptId })),
        },
      },
    });
  }
  async checkout(userId: string): Promise<any> {
    try {
      const amount = await this.calculateCartTotal(userId);
      const payment = await this.paypalService.createPayment(amount);

      const approvalUrl = payment.links.find(
        (link) => link.rel === 'approval_url',
      );

      if (!approvalUrl) {
        throw new InternalServerErrorException('Approval URL not found.');
      }

      return approvalUrl.href; // This URL will be used to redirect the user to PayPal for payment.
    } catch (error) {
      // Assuming `error` is an instance of HttpException
      throw error;
    }
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getUserCart(userId);

    for (const item of cart.cartItems) {
      await this.prismaService.cartItem.delete({ where: { id: item.id } });
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
        throw new BadRequestException('An internal server error occurred.');
    }
  }
}
