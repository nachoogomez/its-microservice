import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE, USERS_SERVICE } from 'src/config';
import { CartAddDto } from './dto/create-cart.dto';
import { handleRpcResponse } from 'src/common/helpers/rpc-error.helper';
import { Usuario } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
    @Inject(PRODUCTS_SERVICE) private readonly productClient: ClientProxy,
  ) {}

  @Post('add-item')
  async addItem(@Usuario() user: any, @Body() dto: CartAddDto) {
    try {

      const product = await handleRpcResponse(
        this.productClient,
        'findOneProducto',
        { id: dto.productId },
      );

  
      if (!product) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }

      if (dto.quantity > product.stock) {
        throw new HttpException('Stock insuficiente', HttpStatus.CONFLICT);
      }

      const userId = user?.id || user?.userId || user?.sub;

      if (!userId) {
        throw new HttpException('Usuario no válido', HttpStatus.UNAUTHORIZED);
      }

      const result = await handleRpcResponse(this.userClient, 'addToCart', {
        userId: Number(userId),
        productId: dto.productId,
        quantity: dto.quantity,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  @Delete('remove-item/:productId')
  async removeItem(
    @Usuario() user: any,
    @Param('productId') productId: number,
  ) {
    const userId = user?.id || user?.userId || user?.sub;

    if (!userId) {
      throw new HttpException('Usuario no válido', HttpStatus.UNAUTHORIZED);
    }

    return handleRpcResponse(this.userClient, 'removeFromCart', {
      userId: Number(userId),
      productId: Number(productId),
    });
  }

  @Get()
  async getCart(@Usuario() user: any) {
    try {
      const userId = user?.id || user?.userId || user?.sub;

      if (!userId) {
        throw new HttpException('Usuario no válido', HttpStatus.UNAUTHORIZED);
      }

      const cartItems = await handleRpcResponse(this.userClient, 'getCart', {
        userId: Number(userId)
      });

      const enrichedCartItems = await Promise.all(
        cartItems.map(async (item: any) => {
          try {
            const product = await handleRpcResponse(
              this.productClient,
              'findOneProducto',
              { id: item.productId }
            );

            return {
              ...item,
              product: product || null
            };
          } catch (error) {
            return {
              ...item,
              product: null
            };
          }
        })
      );

      return enrichedCartItems;
    } catch (error) {
      throw error;
    }
  }
}
