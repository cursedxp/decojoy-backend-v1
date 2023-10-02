import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
// import { Style, Type } from '../concept.entity';
import { Style, Type } from '@prisma/client';

export class CreateConceptDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(Style)
  style: Style;

  @IsEnum(Type)
  type: Type;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  thumbnail: string;
}
