import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { USER_STATUS } from 'src/enums/user';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  UpdateProfileDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(body: SignInDto) {
    const { email, password } = body;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (user.status === USER_STATUS.INACTIVE) {
      throw new BadRequestException('Your account is inactivated');
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    return await this.generateJwt(user);
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const { email } = body;

    const user = await this.userRepository.findOne({
      where: {
        email,
        status: USER_STATUS.ACTIVE,
      },
    });

    if (!user) {
      throw new BadRequestException('Email does not exist');
    }

    const token = await this.encodeToken({
      email,
      exp: new Date().getTime() + 3600 * 1000,
    });

    return token;
  }

  async resetPassword(body: ResetPasswordDto) {
    const { password, confirmPassword, token } = body;

    const payload: {
      email: string;
      exp: number;
    } = await this.decodeToken(token);

    if (!payload.email || !payload.exp || payload.exp < new Date().getTime()) {
      throw new BadRequestException('Token is expired');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException("Confirm password doesn't match");
    }

    const user = await this.userRepository.findOne({
      where: {
        email: payload.email,
        status: USER_STATUS.ACTIVE,
      },
    });

    if (!user) {
      throw new BadRequestException('Token is invalid');
    }

    const salt = await genSalt();
    const hasPassword = await hash(password, salt);

    await this.userRepository.update(
      { id: user.id },
      { password: hasPassword },
    );

    return 'Reset password is successful';
  }

  async changePassword(id: string, body: ChangePasswordDto) {
    const { newPassword, password, confirmPassword } = body;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException("Confirm password doesn't match");
    }

    const user = await this.userRepository.findOne({
      where: {
        id,
        status: USER_STATUS.ACTIVE,
      },
    });

    if (!user) {
      throw new BadRequestException('The user does not found');
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const salt = await genSalt();
    const hasPassword = await hash(newPassword, salt);

    await this.userRepository.update(
      { id: user.id },
      { password: hasPassword },
    );

    return 'Change password is successful';
  }

  async getProfile(id: string) {
    return await this.userService.findUser(id);
  }

  async updateProfile(id: string, body: UpdateProfileDto) {
    return await this.userService.updateUser(id, body);
  }

  async generateJwt(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'secret',
      expiresIn: '36000s',
    });

    delete user.password;

    return { accessToken, user };
  }

  async encodeToken(payload: Record<string, any>) {
    const token = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return token;
  }

  async decodeToken(token: string) {
    return JSON.parse(atob(token));
  }
}
