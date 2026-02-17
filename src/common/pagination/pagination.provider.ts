import { Inject, Injectable, Scope } from '@nestjs/common';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PaginatedInterface } from './interfaces/paginated.interface';

@Injectable({ scope: Scope.REQUEST })
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<PaginatedInterface<T>> {
    const results = await repository.find({
      skip: (paginationQuery.page! - 1) * paginationQuery.limit!,
      take: paginationQuery.limit,
    });
    const baseURL = `${this.request.protocol}://${this.request.headers.host}/`;
    const newUrl = new URL(this.request.url, baseURL);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit!);
    const nextPage =
      paginationQuery.page! >= totalPages
        ? paginationQuery.page
        : paginationQuery.page! + 1;
    const previousPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery.page! - 1;

    const finalRes: PaginatedInterface<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit!,
        totalItems,
        currentPage: paginationQuery.page!,
        totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
      },
    };

    return finalRes;
  }
}
