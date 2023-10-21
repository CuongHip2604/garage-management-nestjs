import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateGarageDto, GarageQueryDto, UpdateGarageDto } from './garage.dto';
import { GarageService } from './garage.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';

@Controller('garages')
@ApiTags('Garages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GarageController {
  constructor(private readonly garageService: GarageService) {}

  @Get()
  async findGarages(@Query() query: GarageQueryDto) {
    const res = await this.garageService.findGarages(query);
    return {
      data: res,
    };
  }

  @Get(':id')
  async findGarage(@Param('id') id: string) {
    const res = await this.garageService.findGarage(id);
    return {
      data: res,
    };
  }

  @Post()
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
  ) {
    const res = await this.garageService.updateGarage(id, body);
    return {
      data: res,
    };
  }

  @Delete(':id')
  async deleteGarage(@Param('id') id: string) {
    const res = await this.garageService.deleteGarage(id);
    return {
      data: res,
    };
  }
}
