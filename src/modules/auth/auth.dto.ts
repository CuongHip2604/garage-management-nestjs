import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { REGEX } from 'src/constants';
import { GENDER } from 'src/enums/user';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  confirmPassword: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  confirmPassword: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  dob: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum(GENDER)
  gender: GENDER;
}
