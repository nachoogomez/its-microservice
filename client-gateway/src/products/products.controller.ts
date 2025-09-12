import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto, FindProductsDto } from './dto/pagination.dto';
import { handleRpcResponse } from 'src/common/helpers/rpc-error.helper';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  //Get all products with pagination
  @Get()
  async getAllProducts(@Query() paginationDto: PaginationDto) {
    return handleRpcResponse(
      this.productsClient,
      'findAllProductos',
      paginationDto,
    );
  }

  //Get all products without pagination
  @Get('all')
  async getAllProductsNoPagination() {
    return handleRpcResponse(
      this.productsClient,
      'findAllProductosNoPagination',
      {},
    );
  }

  //Search products with filters and pagination
  @Get('search')
  async searchProducts(@Query() findProductsDto: FindProductsDto) {
    return handleRpcResponse(
      this.productsClient,
      'searchProductos',
      findProductsDto,
    );
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
  ) {
    return handleRpcResponse(this.productsClient, 'updateProducto', {
      id,
      dto,
    });
  }

  //Delete product
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return handleRpcResponse(this.productsClient, 'removeProducto', { id });
  }
}
