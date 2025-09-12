import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USERS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { handleRpcResponse } from 'src/common/helpers/rpc-error.helper';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    return handleRpcResponse(this.usersClient, 'findAllUser', {});
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return handleRpcResponse(this.usersClient, 'createUser', createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return handleRpcResponse(this.usersClient, 'findOneUser', { id: parseInt(id, 10) });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return handleRpcResponse(this.usersClient, 'updateUser', {
      id: parseInt(id, 10),
      updateUserDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return handleRpcResponse(this.usersClient, 'removeUser', { id: parseInt(id, 10) });
  }
}
