import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppQueryDto } from 'src/app.dto';

export class ServiceQueryDto extends AppQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;
}

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  minPrice: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  maxPrice: number;
}

export class UpdateServiceDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  minPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  maxPrice: number;
}
