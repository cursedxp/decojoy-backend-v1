import { Controller, Body, Post, Get, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, RemoveFromCartDto, CheckoutDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() data: AddToCartDto): Promise<any> {
    return this.cartService.addToCart(data.userId, data.conceptId);
  }

  @Post('remove')
  async removeFromCart(@Body() data: RemoveFromCartDto): Promise<void> {
    return this.cartService.removeFromCart(data.cartItemId);
  }

  @Get(':userId')
  async getUserCart(@Param('userId') userId: string): Promise<any> {
    return this.cartService.getUserCart(userId);
  }
  @Post('checkout')
  async checkout(@Body() data: CheckoutDto): Promise<void> {
    return this.cartService.checkout(data.userId);
  }
}
