import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDto } from './dto/user.dto';
import { v4 as uuid } from 'uuid';
import { DbEnum } from 'src/untils/dbEnum';
import { USERS_DB } from 'src/myDb/myDb';

@Injectable()
export class UsersService {
  async findAll(): Promise<ResponseUserDto[]> {
    return USERS_DB.map((user) => {
      const { id, login, version, createdAt, updatedAt } = user;
      return {
        id,
        login,
        version,
        createdAt,
        updatedAt,
      };
    });
  }

  async findOne(userId: string): Promise<ResponseUserDto | DbEnum> {
    const user = USERS_DB.find((user) => user.id === userId);
    if (!user) return DbEnum.notFound;

    const { id, login, version, createdAt, updatedAt } = user;

    return {
      id,
      login,
      version,
      createdAt,
      updatedAt,
    };
  }

  async create(userForCreate: CreateUserDto): Promise<ResponseUserDto> {
    const { login, password } = userForCreate;
    const createDate = Date.now();

    const createdUser: UserDto = {
      id: this._createUserId(),
      login,
      password,
      version: 1,
      createdAt: createDate,
      updatedAt: createDate,
    };

    USERS_DB.push(createdUser);

    return {
      id: createdUser.id,
      login,
      version: createdUser.version,
      createdAt: createDate,
      updatedAt: createDate,
    } as ResponseUserDto;
  }

  async updatePassword(
    userId: string,
    passwords: UpdatePasswordDto,
  ): Promise<ResponseUserDto | DbEnum> {
    const userForUpdate = USERS_DB.find((user) => user.id === userId);

    if (!userForUpdate) {
      return DbEnum.notFound;
    }

    if (userForUpdate.password !== passwords.oldPassword) {
      return DbEnum.incorrectFields;
    }

    userForUpdate.password = passwords.newPassword;
    userForUpdate.updatedAt = Date.now();
    userForUpdate.version++;

    const { id, login, version, createdAt, updatedAt } = userForUpdate;
    return { id, login, version, createdAt, updatedAt } as ResponseUserDto;
  }

  async delete(userId: string): Promise<string | DbEnum> {
    const user = USERS_DB.find((user) => user.id === userId);

    if (!user) {
      return DbEnum.notFound;
    }

    const deleteUserIndex = USERS_DB.indexOf(user);
    USERS_DB.splice(deleteUserIndex);

    return 'User was deleted!';
  }

  _createUserId(): string {
    return uuid();
  }
}
