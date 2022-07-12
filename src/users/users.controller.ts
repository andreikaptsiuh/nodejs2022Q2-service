import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { validate } from 'uuid';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): ResponseUserDto[] {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): ResponseUserDto | string {
        if (!validate(id)) {
            return 'Id not valid';
        };
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() createUser: CreateUserDto): UserDto {
        return this.usersService.create(createUser);
    }

    @Put(':id')
    update(@Param(':id') id: string, @Body() passwords: UpdatePasswordDto): UserDto | string {
        if (!validate(id)) {
            return 'Id not valid';
        };
        return this.usersService.updatePassword(id, passwords);
    }

    @Delete(':id')
    delete(@Param(':id') id: string): string {
        if (!validate(id)) {
            return 'Id not valid';
        };
        return this.usersService.delete(id);
    }
}
