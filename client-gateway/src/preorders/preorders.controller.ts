import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreatePreOrderDto } from './dto/create-preorder.dto';
import { handleRpcResponse } from 'src/common/helpers/rpc-error.helper';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('preorders')
@UseGuards(JwtAuthGuard)
export class PreOrdersController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  // Create pre-order
  @Post()
  async createPreOrder(@Body() dto: CreatePreOrderDto) {
    return handleRpcResponse(this.productsClient, 'createPreOrder', dto);
  }

  // Confirm purchase
  @Post('confirm-purchase/:userId')
  async confirmPurchase(@Param('userId', ParseIntPipe) userId: number) {
    return handleRpcResponse(this.productsClient, 'confirmPurchase', {
      userId,
    });
  }

  // Get all pre-orders
  @Get()
  async getAllPreOrders(@Param('userId') userId?: number) {
    return handleRpcResponse(this.productsClient, 'findAllPreOrder', {
      userId,
    });
  }

  // Get pre-order by ID
  @Get(':id')
  async getPreOrderById(@Param('id', ParseIntPipe) id: number) {
    return handleRpcResponse(this.productsClient, 'findOnePreOrder', { id });
  }

  // Remove pre-order
  @Delete(':id')
  async removePreOrder(@Param('id', ParseIntPipe) id: number) {
    return handleRpcResponse(this.productsClient, 'removePreOrder', { id });
  }

  // Get pre-order statistics
  @Get('stats/overview')
  async getPreOrderStats() {
    return handleRpcResponse(this.productsClient, 'getPreOrderStats', {});
  }

  // Delete expired pre-orders (admin only)
  @Delete('cleanup/expired')
  async deleteExpiredPreOrders() {
    return handleRpcResponse(this.productsClient, 'deleteExpiredPreOrders', {});
  }
}
