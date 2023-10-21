import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { Garage } from './garage.entity';

@Injectable()
export class GarageRepository extends TypeORMRepository<Garage> {
  constructor(manager: EntityManager) {
    super(Garage, manager);
  }
}
