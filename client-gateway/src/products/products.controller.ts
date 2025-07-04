import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateProductoDto } from './dto/create-producto.dto';
import { handleRpcResponse } from 'src/common/helpers/rpc-error.helper';
import { CreatePreOrderDto } from './dto/create-preorder.dto';



@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ){}

  //Get all products
  @Get()
  async getAllProducts() {
    return handleRpcResponse(this.productsClient, 'findAllProductos', {});
  }

  //Get product by id
  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return handleRpcResponse(this.productsClient, 'findOneProducto', { id });
  }

  //Post product
  @Post()
  async create(@Body() dto: CreateProductoDto) {
    return handleRpcResponse(this.productsClient, 'createProducto', dto);
  }

  //Update product
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProductoDto) {
    return handleRpcResponse(this.productsClient, 'updateProducto', { id, ...dto });
  }

  //Delete product
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return handleRpcResponse(this.productsClient, 'removeProducto', { id });
  }

  //Create pre-order
  @Post('pre-order')
  async createPreOrder(@Body() dto: CreatePreOrderDto) {
    return handleRpcResponse(this.productsClient, 'createPreOrder', dto);
  }

  //Confirm purchase
  @Post('confirm-purchase/:userId')
  async confirmPurchase(@Param('userId', ParseIntPipe) userId: number) {
    return handleRpcResponse(this.productsClient, 'confirmPurchase', { userId });
  }

  //Get all pre-orders
  @Get('pre-orders/:userId')
  async getAllPreOrders(@Param('userId', ParseIntPipe) userId: number) {
    return handleRpcResponse(this.productsClient, 'findAllPreOrder', { userId });
  }
}