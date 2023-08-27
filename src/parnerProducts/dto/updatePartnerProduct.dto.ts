import { IsString } from 'class-validator';
export class UpdatePartnerProductDto {
  @IsString()
  partnerId?: string;
  @IsString()
  productId?: string;
}
