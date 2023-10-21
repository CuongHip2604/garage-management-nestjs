import { Repository, SelectQueryBuilder } from 'typeorm';
export class TypeORMRepository<T> extends Repository<T> {
  async paginate(
    options: { page: number; limit: number },
    query: SelectQueryBuilder<T>,
  ) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;
    query.take(limit).skip(offset);
    const [items, totalItems] = await query.getManyAndCount();
    return {
      items,
      pagination: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: +limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: +page,
      },
    };
  }
}
