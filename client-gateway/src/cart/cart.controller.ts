import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
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
    @Inject(PRODUCTS_SERVICE) private readonly productClient: ClientProxy
  ) {}

  @Post('add-item')
  async addItem(@Usuario() user : any, @Body() dto: CartAddDto) {
    
    try {
      console.log('🔍 Buscando producto con ID:', dto.productId); // Debug
      
      const product = await handleRpcResponse(
        this.productClient,
        'findOneProducto', 
        { id: dto.productId },
      );

      console.log('📦 Producto encontrado:', product); // Debug

      if (!product) {
        console.log('❌ Producto no encontrado'); // Debug
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }

      console.log('📊 Verificando stock:', { requested: dto.quantity, available: product.stock }); // Debug

      if (dto.quantity > product.stock) {
        console.log('❌ Stock insuficiente'); // Debug
        throw new HttpException('Stock insuficiente', HttpStatus.CONFLICT);
      }

      const userId = user?.id || user?.userId || user?.sub;
      console.log('🆔 UserId extraído:', userId); // Debug
      
      if (!userId) {
        throw new HttpException('Usuario no válido', HttpStatus.UNAUTHORIZED);
      }

      console.log('➕ Agregando al carrito...'); // Debug
      
      const result = await handleRpcResponse(
        this.userClient,
        'addToCart', 
        {
          userId: Number(userId),
          productId: dto.productId,
          quantity: dto.quantity,
        },
      );

      console.log('✅ Producto agregado al carrito:', result); // Debug
      return result;
      
    } catch (error) {
      console.error('💥 Error en addItem:', error); // Debug
      throw error;
    }
  }

  @Delete('remove-item/:productId')
  async removeItem(@Usuario() user: any, @Param('productId') productId: number) {
    const userId = user?.id || user?.userId || user?.sub;
    
    if (!userId) {
      throw new HttpException('Usuario no válido', HttpStatus.UNAUTHORIZED);
    }

    return handleRpcResponse(
      this.userClient,
      'removeFromCart',
      {
        userId: Number(userId),
        productId: Number(productId),
      },
    );
  } 
}