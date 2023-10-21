import { Module } from '@nestjs/common';
import { GarageModule } from '../garage/garage.module';
import { GarageRepository } from '../garage/garage.repository';
import { MailModule } from '../mail/mail.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [MailModule, GarageModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, GarageRepository],
  exports: [UserService],
})
export class UserModule {}
