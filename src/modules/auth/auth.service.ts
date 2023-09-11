/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto';
import { AppErrors } from 'src/common/constants/errors';
import { LoginUserDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthUserResponse } from './response';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) { }

  async registerUsers(dto: CreateUserDTO): Promise<AuthUserResponse> {
    try {
      const existUser = await this.userService.findUserByEmail(dto.email);
      if (existUser) throw new BadRequestException(AppErrors.USER_EXIST);
      await this.userService.createUser(dto);
      return this.userService.publicUser(dto.email);
    } catch (error) {
      throw new BadRequestException(AppErrors.USER_EXIST);
    }
  }

  async loginUser(dto: LoginUserDTO): Promise<AuthUserResponse> {
    try {
      const existUser = await this.userService.findUserByEmail(dto.email);
      if (!existUser) throw new BadRequestException(AppErrors.USER_NOT_EXIST);
      const validatePassword = await bcrypt.compare(
        dto.password,
        existUser.password,
      );
      if (!validatePassword) throw new BadRequestException(AppErrors.USER_WRONG_DATA);
      return this.userService.publicUser(dto.email);
    } catch (error) {
      throw new Error(error);
    }
  }
}
