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
import { CreateGarageDto, GarageQueryDto, UpdateGarageDto } from './garage.dto';
import { GarageService } from './garage.service';
import { UserReq } from 'src/decorator/user.decorator';
import { USER_ROLE } from 'src/enums/user';
import { User } from '../user/user.entity';
import { Role } from 'src/decorator/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';

@Role(USER_ROLE.ADMIN)
@Controller('garages')
@ApiTags('Garages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GarageController {
  constructor(private readonly garageService: GarageService) {}

  @Get()
  async findGarages(@Query() query: GarageQueryDto, @UserReq() user: User) {
    const res = await this.garageService.findGarages(query, user);
    return {
      data: res,
    };
  }

  @Get(':id')
  async findGarage(@Param('id') id: string, @UserReq() user: User) {
    const res = await this.garageService.findGarage(id, user);
    return {
      data: res,
    };
  }

  @Post()
  @UseGuards(RoleGuard)
  async createGarage(@Body(ValidationPipe) body: CreateGarageDto) {
    const res = await this.garageService.createGarage(body);
    return {
      data: res,
    };
  }

  @Put(':id')
  async updateGarage(
    @Body(ValidationPipe) body: UpdateGarageDto,
    @Param('id') id: string,
    @UserReq() user: User,
  ) {
    const res = await this.garageService.updateGarage(id, body, user);
    return {
      data: res,
    };
  }

  @Delete(':id')
  async deleteGarage(@Param('id') id: string, @UserReq() user: User) {
    const res = await this.garageService.deleteGarage(id, user);
    return {
      data: res,
    };
  }
}
