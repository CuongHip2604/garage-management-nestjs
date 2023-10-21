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
import {
  CreateServiceDto,
  ServiceQueryDto,
  UpdateServiceDto,
} from './service.dto';
import { ServiceService } from './service.service';

@Controller('services')
@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  @Get()
  async findServices(@Query() query: ServiceQueryDto) {
    const res = await this.service.findServices(query);
    return {
      data: res,
    };
  }

  @Get(':id')
  async findGarage(@Param('id') id: string) {
    const res = await this.service.findService(id);
    return {
      data: res,
    };
  }

  @Post()
  async createService(@Body(ValidationPipe) body: CreateServiceDto) {
    const res = await this.service.createService(body);
    return {
      data: res,
    };
  }

  @Put()
  async updateService(
    @Param('id') id: string,
    @Body(ValidationPipe) body: UpdateServiceDto,
  ) {
    const res = await this.service.updateService(id, body);
    return {
      data: res,
    };
  }

  @Delete(':id')
  async deleteGarage(@Param('id') id: string) {
    const res = await this.service.deleteService(id);
    return {
      data: res,
    };
  }
}
