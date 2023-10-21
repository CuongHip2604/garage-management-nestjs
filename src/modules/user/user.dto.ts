import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { AppQueryDto } from 'src/app.dto';
import { REGEX } from 'src/constants';
import { GENDER, USER_ROLE, USER_STATUS } from 'src/enums/user';

export class UserQueryDto extends AppQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(USER_STATUS)
  status: USER_STATUS;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @Matches(REGEX.PHONE, { message: 'Phone number is invalid' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsEnum(GENDER)
  @IsNotEmpty()
  gender: GENDER;

  @ApiProperty()
  @IsEnum(USER_ROLE)
  @IsNotEmpty()
  role: USER_ROLE;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dob: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1, { message: 'Please add at least one garage' })
  garageIds: string[];
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(GENDER)
  gender: GENDER;

  @ApiProperty()
  @IsOptional()
  @IsEnum(USER_STATUS)
  status: USER_STATUS;

  @ApiProperty()
  @IsOptional()
  @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @ApiProperty()
  @IsString()
  @IsOptional()
  dob: string;
}
