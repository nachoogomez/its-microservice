import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('login')
  login(@Payload() payload: LoginDto){
    return this.userService.login(payload);
  }

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('findAllUser')
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() payload: { id: number }) {
    return this.userService.findOne(payload.id);
  }

  @MessagePattern('updateUser')
  update(@Payload() payload:{id: number; updateUserDto: UpdateUserDto}) {
    return this.userService.update(payload.id, payload.updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() payload: { id: number }) {
    return this.userService.remove(payload.id);
  }

  @MessagePattern('removeFromCart')
  removeFromCart(@Payload() payload: { userId: number; productId: number }) {
    return this.userService.removeFromCart(payload.userId, payload.productId);
  }

  @MessagePattern('getCart')
  getCart(@Payload() payload: { userId: number }) {
    return this.userService.getCart(payload.userId);
  }

  @MessagePattern('addToCart')
  addToCart(@Payload() payload: { userId: number; productId: number; quantity: number }) {
    return this.userService.addToCart(payload.userId, payload.productId, payload.quantity);
  }
}
