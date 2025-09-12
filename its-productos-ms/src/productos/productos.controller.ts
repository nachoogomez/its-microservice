import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from '../common';
import { FindProductsDto } from './dto/find-products.dto';

@Controller()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @MessagePattern('createProducto')
  create(@Payload() createProductoDto: CreateProductoDto ) {
    return this.productosService.create(createProductoDto);
  }

  @MessagePattern('findAllProductos')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productosService.findAll(paginationDto);
  }

  @MessagePattern('findAllProductosNoPagination')
  findAllNoPagination() {
    return this.productosService.findAllNoPagination();
  }

  @MessagePattern('searchProductos')
  searchProducts(@Payload() findProductsDto: FindProductsDto) {
    return this.productosService.searchProducts(findProductsDto);
  }

  @MessagePattern('findOneProducto')
  findOne(@Payload() payload: { id: number }) {
    return this.productosService.findOne(payload.id);
  }

  @MessagePattern('updateProducto')
  update(@Payload() payload: { id: number; dto: UpdateProductoDto }) {
    return this.productosService.update(payload.id, payload.dto);
  }

  @MessagePattern('removeProducto')
  remove(@Payload() payload: { id: number }) {
    return this.productosService.remove(payload.id);
  }

}
