import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { omit } from 'lodash';
import { GARAGE_STATUS } from 'src/enums/garage';
import { In, ILike } from 'typeorm';
import { GarageRepository } from '../garage/garage.repository';
import { GarageService } from '../garage/garage.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './user.dto';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from '../auth/auth.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly garageRepository: GarageRepository,
    private readonly garageService: GarageService,
  ) {}

  async findUsers(query: UserQueryDto) {
    const { email, name, status } = query;

    const page = +query.page || 1;
    const limit = +query.limit || 10;

    const offset = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (name) {
      queryBuilder.andWhere({ fullName: ILike(`%${name}%`) });
    }
    if (email) {
      queryBuilder.andWhere({ email: ILike(`%${email}%`) });
    }
    if (status) {
      queryBuilder.andWhere({ status: ILike(`%${status}%`) });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      items: data.map((user) => omit(user, ['password'])),
      pagination: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async findUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        garages: true,
      },
    });

    if (!user) {
      throw new BadGatewayException('The user does not found');
    }

    return omit(user, ['password']);
  }

  async createUser(body: CreateUserDto, creator: string) {
    const {
      email,
      password,
      fullName,
      gender,
      dob,
      role,
      phoneNumber,
      garageIds,
    } = body;

    if (!garageIds?.length) {
      throw new BadRequestException('Please add at least one garage');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException('The email is existed');
    }

    const garages = await this.garageRepository.find({
      where: {
        id: In(garageIds),
        status: GARAGE_STATUS.ACTIVE,
      },
    });

    if (garages.length !== garageIds.length) {
      throw new BadGatewayException('Garages is invalid');
    }

    const salt = await genSalt();
    const hasPassword = await hash(password, salt);

    await this.userRepository.save({
      email,
      password: hasPassword,
      fullName,
      role,
      dob,
      gender,
      garages,
      phoneNumber,
    });

    await this.garageService.updateMultipleGarageStatus(
      garageIds,
      GARAGE_STATUS.ASSIGNED,
    );

    const mailDetail = {
      from: `Creating Account <${creator}>`,
      to: email,
      subject: 'Your account has been created by Admin',
      text: `Your account has been created by Admin. Your account is ${email} and your password is ${password}`,
    };

    await this.mailService.sendMail(mailDetail);

    return 'Create user is successful';
  }

  async updateUser(id: string, body: UpdateUserDto | UpdateProfileDto) {
    const existingUser = await this.findUser(id);

    Object.assign(existingUser, body);

    await this.userRepository.save(existingUser);

    return 'Updating user is successful';
  }

  async deleteUser(id: string) {
    const user = await this.findUser(id);

    if (user.garages.length) {
      throw new BadGatewayException(
        'This user assigned garages so you can not remove this user',
      );
    }

    await this.userRepository.delete({ id });

    return 'Deleting user is successful';
  }
}
