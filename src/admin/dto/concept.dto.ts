import { IsString, IsArray } from 'class-validator';

export class ConceptDto {
  @IsString()
  title: string;

  @IsString()
  thumbnail: string;

  @IsArray()
  images: string[];

  @IsString()
  description: string;

  @IsString()
  style: string;

  @IsString()
  roomType: string;

  @IsString()
  userId: string;

  @IsArray()
  productIds: string[];
}
