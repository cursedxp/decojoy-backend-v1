import { IsString } from 'class-validator';

export class CreatePartnerProductDto {
  @IsString()
  partnerId: string;

  @IsString()
  productId: string;
}
