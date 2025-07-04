import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/producto.entity';
import { PreOrder } from './entities/preorder.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Product, PreOrder])], 
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
