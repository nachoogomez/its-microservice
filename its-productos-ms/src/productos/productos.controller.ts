import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreatePreOrderDto } from './dto/create-preorder.dto';

@Controller()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @MessagePattern('createProducto')
  create(@Payload() createProductoDto: CreateProductoDto ) {
    return this.productosService.create(createProductoDto);
  }

  @MessagePattern('findAllProductos')
  findAll() {
    return this.productosService.findAll();
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

  @MessagePattern('confirmPurchase')
  confirmPurchase(@Payload() userId: number) {
    return this.productosService.confirmPurchase(userId);
  }

  @MessagePattern('findAllPreOrder')
  findAllPreOrder(@Payload() userId?: number) {
    return this.productosService.findAllPreOrder(userId);
  }

  @MessagePattern('createPreOrder')
   createPreOrder(@Payload() dto: CreatePreOrderDto) {
    return this.productosService.createPreOrder(dto);
  }
}
