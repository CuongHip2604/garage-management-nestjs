import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { Service } from './service.entity';

@Injectable()
export class ServiceRepository extends TypeORMRepository<Service> {
  constructor(manager: EntityManager) {
    super(Service, manager);
  }
}
