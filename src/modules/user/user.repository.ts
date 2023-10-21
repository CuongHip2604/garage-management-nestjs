import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { EntityManager } from 'typeorm';
import { TypeORMRepository } from 'src/database/typeorm.repository';

@Injectable()
export class UserRepository extends TypeORMRepository<User> {
  constructor(manager: EntityManager) {
    super(User, manager);
  }
}
