import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { AppQueryDto } from 'src/app.dto';
import { REGEX } from 'src/constants';
import { GARAGE_STATUS } from 'src/enums/garage';

export class GarageQueryDto extends AppQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  phone: string;

  @ApiProperty({ required: false })
  @IsEnum(GARAGE_STATUS)
  status: GARAGE_STATUS;
}

export class CreateGarageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PHONE, {
    message: 'Phone number is invalid',
  })
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  policy: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  openTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  closeTime: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1, { message: 'Please add at least one service' })
  serviceIds: string[];
}

export class UpdateGarageDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  policy: string;

  @ApiProperty()
  @IsEnum(GARAGE_STATUS)
  @IsOptional()
  status: GARAGE_STATUS;

  @ApiProperty()
  @IsString()
  @IsOptional()
  openTime: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  closeTime: string;
}
