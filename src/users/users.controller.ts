import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
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
    findAll(): ResponseUserDto[] {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Res({ passthrough: true }) res: Response, @Param('id') id: string): ResponseUserDto | string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        const result = this.usersService.findOne(id);

        if(result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `User with id: ${id} not found`;
        };

        return result as ResponseUserDto;
    }

    @Post()
    create(@Res({ passthrough: true }) res: Response, @Body() createUser: CreateUserDto): UserDto | string {
        if (!createUser.login || !createUser.password) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Login and password fields is required!'
        };

        return this.usersService.create(createUser);
    }

    @Put(':id')
    update(@Res({ passthrough: true }) res: Response, @Param('id') id: string, @Body() passwords: UpdatePasswordDto): UserDto | string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        const result = this.usersService.updatePassword(id, passwords);

        if(result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `User with id: ${id} not found`;
        };

        if(result === DbEnum.incorrectFiels) {
            res.status(HttpStatus.FORBIDDEN);
            return 'Old password wrong!';
        };

        return result as UserDto;
    }

    @Delete(':id')
    delete(@Res({ passthrough: true }) res: Response, @Param('id') id: string): string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        const result = this.usersService.delete(id);

        if(result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `User with id: ${id} not found`;
        };

        res.status(HttpStatus.NO_CONTENT);
        return result as string;
    }
}
