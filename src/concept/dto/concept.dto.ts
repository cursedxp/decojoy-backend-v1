import { IsString, IsArray, IsOptional, IsInt, IsEnum } from 'class-validator';
import { Style, Room } from '@prisma/client';

export class CreateConceptDto {
  @IsString()
  title: string;

  @IsString()
  thumbnail: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  description: string;

  @IsEnum(Style)
  style: Style;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsEnum(Room)
  roomType: Room;

  @IsOptional()
  @IsString()
  userId?: string;
}
