import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import * as cron from 'node-cron';
import { rpcError } from './helpers/rpc.helpers';
import { LoginDto } from './dto/login.dto';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
    cron.schedule('0 0 * * *', async () => {
      console.log('Cleanning old carts');
      await this.cleanOldCarts();
    });
  }

  // This method is used to create a new user
  async create(newUser: CreateUserDto) {
    if (!newUser){
      throw rpcError('Invalid user data', HttpStatus.BAD_REQUEST);
    }

   const existingUser = await this.prisma.user.findUnique({
      where: { email: newUser.email },
    });

    if (existingUser) {
      throw rpcError('Email already in use', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.authService.hashPassword(newUser.password);
    return this.prisma.user.create({
      data: {
        email: newUser.email,
        password: hashedPassword,
        name: newUser.name,
      },
      })
  }

  // This method is used to find all users
  async findAll() {
    return this.prisma.user.findMany();
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    
      const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw rpcError('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.authService.hashPassword(updateUserDto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // This method is used to find a user by id
  async findOne(id: number | string) {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw rpcError('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
    where: { email: loginDto.email },
    select: {
    id: true,
    email: true,
    password: true,
    name: true,
    },
  });

    if (!user) {
      throw rpcError('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.password) {
      throw rpcError('Password not set', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.authService.compararPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw rpcError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    
    return {
      sub: user.id,
      email: user.email,
      name: user.name ?? '',
    };
  }


  // This method is used to remove a user by id
  async remove(id: number | string) {
    try {
      const userId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (isNaN(userId)) {
        throw rpcError('Invalid user id', HttpStatus.BAD_REQUEST);
      }

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      
      if (!user) {
        throw rpcError(`User not found`, HttpStatus.NOT_FOUND);
      }

      return this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (err: any) {
      throw rpcError(`Error: ${err?.message || err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async cleanOldCarts() {
    try {
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const oldItems = await this.prisma.cart.findMany({
        where: {
          createdAt: {
            lt: oneDayAgo,
          },
        },
      });
      
       if (oldItems.length > 0) {
        const ids = oldItems.map((item) => item.id);
        await this.prisma.cart.deleteMany({
          where: { id: { in: ids } },
        });
        console.log(` Se eliminaron ${ids.length} items viejos del carrito`);
     }
    } 
    catch (error) {
      throw rpcError(`Error cleaning old carts: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addToCart(userId: number, productId: number, quantity: number) {

    const existingCartItem = await this.prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      },
    },
  });
   if (existingCartItem) {
    return this.prisma.cart.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });
  } else {
    return this.prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
  }
}


  async getCart(userId: number) {
    return this.prisma.cart.findMany({
      where: { userId },
    });
  }

  async removeFromCart(userId: number, productId: number) {
    const cartItem = await this.prisma.cart.findUnique({
      where: { 
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw rpcError('Cart item not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.cart.delete({
      where: { id: cartItem.id },
    });
  }
}
