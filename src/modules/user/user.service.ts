/* eslint-disable prettier/prettier */
// import { BadRequestException, Injectable } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { WatchList } from '../watchlist/models/watchlist.model';
// import { AppErrors } from 'src/common/constants/errors';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
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

  async publicUser(email: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { email: email },
        attributes: { exclude: ['password'] },
        include: {
          model: WatchList,
          required: false,
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      await this.userRepository.update(dto, {
        where: { email: email },
      });
      return dto;
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
