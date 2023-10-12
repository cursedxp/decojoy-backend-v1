import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsString()
  url: string;
}
