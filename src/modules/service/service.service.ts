import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  CreateServiceDto,
  ServiceQueryDto,
  UpdateServiceDto,
} from './service.dto';
import { ServiceRepository } from './service.repository';
import { ILike } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async findServices(query: ServiceQueryDto) {
    const { name } = query;

    const page = +query.page || 1;
    const limit = +query.limit || 10;

    const offset = (page - 1) * limit;

    const queryBuilder = this.serviceRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (name) {
      queryBuilder.andWhere({ name: ILike(`%${name}%`) });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      items: data,
      pagination: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async findService(id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: {
        garages: true,
      },
    });

    if (!service) {
      throw new BadRequestException('The service does not found');
    }

    return service;
  }

  async createService(body: CreateServiceDto) {
    const { description, maxPrice, minPrice, name } = body;

    const isExistedName = await this.serviceRepository.findOne({
      where: {
        name,
      },
    });

    if (isExistedName) {
      throw new BadGatewayException('The service is existed');
    }

    await this.serviceRepository.insert({
      description,
      maxPrice,
      minPrice,
      name,
    });

    return 'Creating service is successful';
  }

  async updateService(id: string, body: UpdateServiceDto) {
    const existingService = await this.findService(id);

    Object.assign(existingService, body);

    await this.serviceRepository.save(existingService);

    return 'Updating service is successful';
  }

  async deleteService(id: string) {
    const service = await this.findService(id);

    if (service.garages?.length) {
      throw new BadRequestException(
        'This service assigned garages so you can not remove this service',
      );
    }

    await this.serviceRepository.delete(id);

    return 'Deleting service is successful';
  }
}
