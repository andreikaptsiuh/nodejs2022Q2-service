import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { validate } from 'uuid';
import { Response } from 'express';
import { DbEnum } from 'src/untils/dbEnum';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<ResponseUserDto | string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const result = await this.usersService.findOne(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `User with id: ${id} not found`;
    }

    return result as ResponseUserDto;
  }

  @Post()
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() createUser: CreateUserDto,
  ): Promise<ResponseUserDto | string> {
    if (!createUser.login || !createUser.password) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Login and password fields is required!';
    }

    return await this.usersService.create(createUser);
  }

  @Put(':id')
  async update(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @Body() passwords: UpdatePasswordDto,
  ): Promise<ResponseUserDto | string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    if (
      passwords.oldPassword === undefined ||
      passwords.newPassword === undefined
    ) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Old password and new password fields is required!';
    }

    const result = await this.usersService.updatePassword(id, passwords);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `User with id: ${id} not found`;
    }

    if (result === DbEnum.incorrectFields) {
      res.status(HttpStatus.FORBIDDEN);
      return 'Old password wrong!';
    }

    return result as UserDto;
  }

  @Delete(':id')
  async delete(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const result = await this.usersService.delete(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `User with id: ${id} not found`;
    }

    res.status(HttpStatus.NO_CONTENT);
    return result as string;
  }
}
