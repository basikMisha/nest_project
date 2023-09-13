/* eslint-disable prettier/prettier */  
import { Controller, Body, Patch, UseGuards, Req, Delete} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdatePasswordDTO, UpdateUserDTO } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CreateUserDTO } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('create-user')
  // createUsers(@Body() dto: CreateUserDTO) {
  //   return this.userService.createUser(dto);
  // }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: UpdateUserDTO })
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(
    @Body() updateDto: UpdateUserDTO,
    @Req() request,
  ): Promise<UpdateUserDTO> {
    const user = request.user;
    return this.userService.updateUser(user.id, updateDto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200})
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDTO,
    @Req() request,
  ): Promise<any> {
    const user = request.user;
    return this.userService.updateUserPassword(user.id, updatePasswordDto);
  }

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Req() request): Promise<boolean> {
    const user = request.user;
    return this.userService.deleteUser(user.email);
  }
}
