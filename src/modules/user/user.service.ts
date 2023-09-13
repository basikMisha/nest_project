/* eslint-disable prettier/prettier */
// import { BadRequestException, Injectable } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from './dto';
import { WatchList } from '../watchlist/models/watchlist.model';
import { TokenService } from '../token/token.service';
import { AuthUserResponse } from '../auth/response';
import { AppErrors } from 'src/common/constants/errors';
// import { AppErrors } from 'src/common/constants/errors';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly tokenService: TokenService,
  ) { }

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { email: email },
        include: {
          model: WatchList,
          required: false,
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserById(id: number): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { id: id },
        include: {
          model: WatchList,
          required: false,
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async publicUser(email: string): Promise<AuthUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        attributes: { exclude: ['password'] },
        include: {
          model: WatchList,
          required: false,
        }
      });
      const token = await this.tokenService.generateJwtToken(user);
      return {user, token};
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(id: number, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      await this.userRepository.update(dto, {
        where: { id: id },
      });
      return dto;
    } catch (error) {
      throw new Error(error);
    }
  }


  async updateUserPassword(id: number, dto: UpdatePasswordDTO): Promise<any> {
    try {
      const user = await this.findUserById(id);
      const currentPassword = await bcrypt.compare(dto.oldPassword, user.password);
      if(!currentPassword) return new BadRequestException(AppErrors.USER_WRONG_DATA);
      const data = {
        password: await this.hashPassword(dto.newPassword)
      }
     return await this.userRepository.update(data, {where: { id: id },});
    } catch (error) {
      throw new Error(error);
    }
  }

  

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      dto.password = await this.hashPassword(dto.password);
      const newUser = {
        firstName: dto.firstName,
        userName: dto.userName,
        email: dto.email,
        password: dto.password,
      };
      await this.userRepository.create(newUser);
      return dto;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      await this.userRepository.destroy({ where: { email: email } });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
