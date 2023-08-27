import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  page? = 1;

  @IsOptional()
  @IsNumber()
  limit? = 10;
}
