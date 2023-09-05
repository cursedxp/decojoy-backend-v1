import { IsNotEmpty, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  conceptId: string;
}

export class RemoveFromCartDto {
  @IsNotEmpty()
  @IsString()
  cartItemId: string;
}

export class CheckoutDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
