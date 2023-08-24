import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
} from 'class-validator';

export class CreateAndAddProductToConceptDto {
  @IsNotEmpty()
  @IsString()
  conceptId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
