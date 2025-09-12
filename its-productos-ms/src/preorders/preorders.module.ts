import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreOrdersService } from './preorders.service';
import { PreOrdersController } from './preorders.controller';
import { PreOrder } from './entities/preorder.entity';
import { Product } from '../productos/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PreOrder, Product])
  ],
  controllers: [PreOrdersController],
  providers: [PreOrdersService],
  exports: [PreOrdersService],
})
export class PreOrdersModule {}

