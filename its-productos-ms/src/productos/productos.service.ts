import { Injectable, Logger } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/producto.entity';
import { LessThan, Repository } from 'typeorm';
import { PreOrder } from './entities/preorder.entity';
import * as cron from 'node-cron';
import { rpcError } from './helpers/rpc.herlpes';
import { CreatePreOrderDto } from './dto/create-preorder.dto';
import { PaginationDto } from 'src/common';



@Injectable()
export class ProductosService {
  private readonly logger = new Logger(ProductosService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productoRepository: Repository<Product>,
    @InjectRepository(PreOrder)
    private readonly preOrderRepository: Repository<PreOrder>,
  ) {
    //Cron
    cron.schedule('0 0 * * *', async () => {
      console.log('Running cron job to delete expired pre-orders');
      await this.deleteExpiredPreOrders();
      
    })
  }

  async create(createProductoDto: CreateProductoDto): Promise<Product> {
    try {
      const product = this.productoRepository.create(createProductoDto);
      return this.productoRepository.save(product);
    } catch (error) {
      throw rpcError('error creating product ' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.productoRepository.find();
    } catch (error) {
      throw rpcError('error finding all products ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productoRepository.findOne({ where: { id } });
      if (!product) {
        throw rpcError('Product not found', 404);
      }
      return product;
    } catch (error) {
      throw rpcError('error finding product ' + error.message);
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      const {id: _, ...updateData} = updateProductoDto; // Exclude id from update data
      const product = await this.productoRepository.findOne({ where: { id } });
      if (!product) {
        throw rpcError('Product not found', 404);
      }
      Object.assign(product, updateData);
      return this.productoRepository.save(product);
    } catch (error) {
      throw rpcError('error updating product ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.productoRepository.findOne({ where: { id } });
      if (!product) {
        throw rpcError('Product not found', 404);
      }
     return await this.productoRepository.remove(product);
    } catch (error) {
      throw rpcError(`Error al eliminar el producto: ${error.message}`);
    }
  }

  async createPreOrder(dto: CreatePreOrderDto) {
    try {
      const product = await this.productoRepository.findOne({ where: { id: dto.productId } });
      if (!product) {
        throw rpcError('Product not found', 404);
      }

      if (product.stock < dto.quantity) {
        throw rpcError('Insufficient stock', 400);
      }

      const preOrder = this.preOrderRepository.create({
        ...dto,
        product,
      });

      return this.preOrderRepository.save(preOrder);
    } catch (error) {
      throw rpcError('Error creating pre-order: ' + error.message);
    }
  }

  async confirmPurchase(userId: number) {
    try {
      const preOrders = await this.preOrderRepository.find({ where: { userId } });

      if (preOrders.length === 0) {
        throw rpcError('No pending pre-orders found for this user', 404);
      }

      for (const preOrder of preOrders) {
        preOrder.product.stock -= preOrder.quantity;
        await this.productoRepository.save(preOrder.product);
        await this.preOrderRepository.remove(preOrder);
      }

      return { message: 'Purchase confirmed successfully' };
    }
    catch (error) {
      throw rpcError('Error confirming purchase: ' + error.message);
    }
  }

  async findAllPreOrder(userId?: number) {
    try {
      if (userId) {
        return await this.preOrderRepository.find({ where: { userId }, relations: ['product'] });
      }
      return await this.preOrderRepository.find();
    } catch (error) {
      throw rpcError('Error finding pre-orders: ' + error.message);
    }
  }

  async deleteExpiredPreOrders() {
    try {
      const limitDate = new Date();
      limitDate.setHours(limitDate.getHours() - 10); // 10 hours ago

      const expiredPreOrders = await this.preOrderRepository.find({
        where: {
          createdAt: LessThan(limitDate),
        },
        })

      if (expiredPreOrders.length > 0) {
        this.logger.log(`Deleting ${expiredPreOrders.length} expired pre-orders`);
        await this.preOrderRepository.remove(expiredPreOrders);
      }

    } catch (error) {
      throw rpcError('Error deleting expired pre-orders: ' + error.message);
    }
  }
}
