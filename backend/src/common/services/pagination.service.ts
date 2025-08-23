import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedData } from '../interfaces/api-response.interface';

@Injectable()
export class PaginationService {
  createPaginationOptions(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
      page,
      limit,
    };
  }

  createPaginatedResponse<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedData<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
