import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './user.dto';
import { UserService } from './user.service';
import { UserReq } from 'src/decorator/user.decorator';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findUsers(@Query() query: UserQueryDto) {
    const res = await this.userService.findUsers(query);
    return {
      data: res,
    };
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const res = await this.userService.findUser(id);
    return {
      data: res,
    };
  }

  @Post()
  async createUser(
    @Body(ValidationPipe) body: CreateUserDto,
    @UserReq('email') email: string,
  ) {
    const res = await this.userService.createUser(body, email);
    return {
      data: res,
    };
  }

  @Put(':id')
  async updateUser(
    @Body(ValidationPipe) body: UpdateUserDto,
    @Param('id') id: string,
  ) {
    const res = await this.userService.updateUser(id, body);
    return {
      data: res,
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const res = await this.userService.deleteUser(id);
    return {
      data: res,
    };
  }
}
