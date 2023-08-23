import { IsString, IsInt, IsOptional } from 'class-validator';

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
  @IsInt()
  price?: number;

  @IsString()
  url: string;
}
