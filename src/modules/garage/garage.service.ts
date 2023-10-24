import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { GARAGE_STATUS } from 'src/enums/garage';
import { USER_ROLE } from 'src/enums/user';
import { ILike, In } from 'typeorm';
import { ServiceRepository } from '../service/service.repository';
import { CreateGarageDto, GarageQueryDto, UpdateGarageDto } from './garage.dto';
import { GarageRepository } from './garage.repository';
import { User } from '../user/user.entity';

@Injectable()
export class GarageService {
  constructor(
    private readonly garageRepository: GarageRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async findGarages(query: GarageQueryDto, user: User) {
    const { email, name, status, phone } = query;
    const { role, id } = user;

    const page = +query.page || 1;
    const limit = +query.limit || 10;

    const offset = (page - 1) * limit;

    const queryBuilder = this.garageRepository
      .createQueryBuilder('garage')
      .take(limit)
      .skip(offset);

    if (role === USER_ROLE.USER) {
      queryBuilder
        .innerJoin('garage.user', 'user')
        .andWhere('user.role = :role', { role })
        .andWhere('user.id = :id', { id });
    }

    if (name) {
      queryBuilder.andWhere({ fullName: ILike(`%${name}%`) });
    }
    if (email) {
      queryBuilder.andWhere({ email: ILike(`%${email}%`) });
    }
    if (status) {
      queryBuilder.andWhere({ status: ILike(`%${status}%`) });
    }
    if (phone) {
      queryBuilder.andWhere({ phoneNumber: ILike(`%${phone}%`) });
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

  async findGarage(id: string, user?: User) {
    const garage = await this.garageRepository.findOne({
      where: {
        id,
        user: {
          id: user?.role === USER_ROLE.USER ? user.id : null,
        },
      },
      relations: {
        services: true,
        user: true,
      },
      select: {
        user: {
          id: true,
          fullName: true,
        },
        services: {
          id: true,
          name: true,
        },
      },
    });

    if (!garage) {
      throw new BadRequestException('The garage does not found');
    }

    return garage;
  }

  async createGarage(body: CreateGarageDto) {
    const {
      name,
      address,
      closeTime,
      description,
      email,
      openTime,
      phoneNumber,
      policy,
      serviceIds,
    } = body;

    if (!serviceIds?.length) {
      throw new BadRequestException('Please add at least one service');
    }

    const isExistedEmail = await this.garageRepository.findOne({
      where: {
        email,
      },
    });

    if (isExistedEmail) {
      throw new BadRequestException('The garage is existed');
    }

    const isExistedPhone = await this.garageRepository.findOne({
      where: {
        phoneNumber,
      },
    });

    if (isExistedPhone) {
      throw new BadRequestException('The garage is existed');
    }

    let services = [];

    if (serviceIds?.length) {
      services = await this.serviceRepository.find({
        where: {
          id: In(serviceIds),
        },
      });
    }

    if (services.length !== serviceIds.length) {
      throw new BadGatewayException('Services is invalid');
    }

    const garage = await this.garageRepository.create({
      name,
      address,
      closeTime,
      description,
      email,
      openTime,
      phoneNumber,
      policy,
    });

    garage.services = services;

    await this.garageRepository.save(garage);

    return 'Create garage is successful';
  }

  async updateGarage(id: string, body: UpdateGarageDto, user: User) {
    const existingGarage = await this.findGarage(id, user);

    Object.assign(existingGarage, body);

    await this.garageRepository.save(existingGarage);

    return 'Update garage is successful';
  }

  async deleteGarage(id: string, user: User) {
    const garage = await this.findGarage(id, user);

    if (garage.user || garage.services.length) {
      throw new BadRequestException(
        'This garage assigned services and user so you can not remove this garage',
      );
    }

    await this.garageRepository.delete(id);

    return 'Delete garage is successful';
  }

  async updateMultipleGarageStatus(ids: string[], newStatus: GARAGE_STATUS) {
    for (const id of ids) {
      const garage = await this.findGarage(id);

      garage.status = newStatus;
      await this.garageRepository.save(garage);
    }

    return 'Updating garage status is successful';
  }
}
