import { IsNotEmpty, IsString } from 'class-validator';
export class AddProductToConceptDto {
  @IsNotEmpty()
  @IsString()
  conceptId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsString()
  partnerId?: string;
  @IsString()
  newPartnerName?: string;
}
