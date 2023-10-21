import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserReq } from 'src/decorator/user.decorator';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  UpdateProfileDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body(ValidationPipe) body: SignInDto) {
    const res = await this.authService.signIn(body);
    return {
      data: res,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body(ValidationPipe) body: ForgotPasswordDto) {
    const res = await this.authService.forgotPassword(body);
    return {
      data: res,
    };
  }
  @Put('reset-password')
  async resetPassword(@Body(ValidationPipe) body: ResetPasswordDto) {
    const res = await this.authService.resetPassword(body);
    return {
      data: res,
    };
  }

  @Put('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body(ValidationPipe) body: ChangePasswordDto,
    @UserReq('id') id: string,
  ) {
    const res = await this.authService.changePassword(id, body);
    return {
      data: res,
    };
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getProfile(@UserReq('id') id: string) {
    const res = await this.authService.getProfile(id);
    return {
      data: res,
    };
  }

  @Put('update-profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @UserReq('id') id: string,
    @Body(ValidationPipe) body: UpdateProfileDto,
  ) {
    const res = await this.authService.updateProfile(id, body);
    return {
      data: res,
    };
  }
}
