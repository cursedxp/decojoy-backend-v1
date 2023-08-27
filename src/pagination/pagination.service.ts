import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto';

@Injectable()
export class PaginationService {
  paginate(paginationDto: PaginationDto) {
    const limit = paginationDto.limit || 10;
    const skip = (paginationDto.page - 1) * limit || 0;
    return { limit, skip };
  }
}
