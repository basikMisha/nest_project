/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty()
  @IsString()
  email: string

  @ApiProperty()
  @IsString()
  password: string

//   @IsString()
//   list: string 
}

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty()
  @IsString()
  email: string
}

export class UpdatePasswordDTO {
  @ApiProperty()
  @IsString()
  oldPassword: string

  @ApiProperty()
  @IsString()
  newPassword: string
}