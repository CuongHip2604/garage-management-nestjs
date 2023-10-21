import { Module } from '@nestjs/common';
import { ServiceRepository } from '../service/service.repository';
import { GarageController } from './garage.controller';
import { GarageRepository } from './garage.repository';
import { GarageService } from './garage.service';

@Module({
  controllers: [GarageController],
  providers: [GarageService, GarageRepository, ServiceRepository],
  exports: [GarageService],
})
export class GarageModule {}
