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
    const result = await handleRpcResponse(
      this.productsClient,
      'findAllProductos',
      paginationDto,
    );
    
    // Wrap the response in the required nested data structure
    return {
      data: {
        data: result.data,
        meta: result.meta
      }
    };
  }

  //Get all products without pagination
  @Get('all')
  async getAllProductsNoPagination() {
    const products = await handleRpcResponse(
      this.productsClient,
      'findAllProductosNoPagination',
      {},
    );
    
    // Wrap the response in the required nested data structure
    return {
      data: {
        data: products
      }
    };
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
