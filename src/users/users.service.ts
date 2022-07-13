import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseUserDto } from "./dto/response-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UserDto } from "./dto/user.dto";
import { v4 as uuid } from 'uuid';
import { DbEnum } from "src/untils/dbEnum";

@Injectable()
export class UsersService {
    private users: UserDto[] = [];

    findAll(): ResponseUserDto[] {
        return this.users.map((user) => {
            const { id, login, version, createdAt, updatedAt } = user;
            return {
                id,
                login,
                version,
                createdAt,
                updatedAt
            }
        });
    }

    findOne(userId: string): ResponseUserDto | DbEnum {
        const user = this.users.find((user) => user.id === userId);
        if (!user) return DbEnum.notFound;

        const { id, login, version, createdAt, updatedAt } = user;

        return {
            id,
            login,
            version,
            createdAt,
            updatedAt
        }
    }

    create(userForCreate: CreateUserDto): UserDto {
        const { login, password } = userForCreate;
        const createDate = Date.now();

        const createdUser: UserDto = {
            id: this._createUserId(),
            login,
            password,
            version: 1,
            createdAt: createDate,
            updatedAt: createDate
        };

        this.users.push(createdUser);

        return createdUser;
    }

    updatePassword(userId: string, passwords: UpdatePasswordDto): UserDto | DbEnum {
        const userForUpdate = this.users.find((user) => user.id === userId);

        if (!userForUpdate) {
            return DbEnum.notFound;
        }

        if (userForUpdate.password === passwords.oldPassword) {
            userForUpdate.password = passwords.newPassword;
            userForUpdate.updatedAt = Date.now();
            userForUpdate.version++;
            return userForUpdate;
        } else {
            return DbEnum.incorrectFiels;
        }
    }

    delete(userId: string): DbEnum | string {
        const user = this.users.find((user) => user.id === userId);

        if(!user) {
            return DbEnum.notFound;
        };

        const deleteUserIndex = this.users.indexOf(user);
        this.users.splice(deleteUserIndex);

        return 'User was deleted!';
    }

    _createUserId(): string {
        return uuid();
    };
}
