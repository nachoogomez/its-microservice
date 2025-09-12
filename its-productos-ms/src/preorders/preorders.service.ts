import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { PreOrder } from './entities/preorder.entity';
import { Product } from '../productos/entities/producto.entity';
import { CreatePreOrderDto } from './dto/create-preorder.dto';
import { rpcError } from '../productos/helpers/rpc.helpers';
import * as cron from 'node-cron';

@Injectable()
export class PreOrdersService {
  private readonly logger = new Logger(PreOrdersService.name);

  constructor(
    @InjectRepository(PreOrder)
    private readonly preOrderRepository: Repository<PreOrder>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    // Cron job para eliminar pre-órdenes expiradas
    cron.schedule('0 0 * * *', async () => {
      this.logger.log('Running cron job to delete expired pre-orders');
      await this.deleteExpiredPreOrders();
    });
  }

  /**
   * Crea una nueva pre-orden
   */
  async createPreOrder(dto: CreatePreOrderDto): Promise<PreOrder> {
    try {
      const product = await this.productRepository.findOne({ 
        where: { id: dto.productId } 
      });
      
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

      return await this.preOrderRepository.save(preOrder);
    } catch (error) {
      throw rpcError('Error creating pre-order: ' + error.message);
    }
  }

  /**
   * Confirma la compra de todas las pre-órdenes de un usuario
   */
  async confirmPurchase(userId: number): Promise<{ message: string }> {
    try {
      const preOrders = await this.preOrderRepository.find({ 
        where: { userId },
        relations: ['product']
      });

      if (preOrders.length === 0) {
        throw rpcError('No pending pre-orders found for this user', 404);
      }

      // Verificar stock nuevamente antes de confirmar
      for (const preOrder of preOrders) {
        if (preOrder.product.stock < preOrder.quantity) {
          throw rpcError(`Insufficient stock for product ${preOrder.product.nombre}`, 400);
        }
      }

      // Actualizar stock y eliminar pre-órdenes
      for (const preOrder of preOrders) {
        preOrder.product.stock -= preOrder.quantity;
        await this.productRepository.save(preOrder.product);
        await this.preOrderRepository.remove(preOrder);
      }

      this.logger.log(`Purchase confirmed for user ${userId}, ${preOrders.length} items processed`);
      return { message: 'Purchase confirmed successfully' };
    } catch (error) {
      throw rpcError('Error confirming purchase: ' + error.message);
    }
  }

  /**
   * Obtiene todas las pre-órdenes, opcionalmente filtradas por usuario
   */
  async findAllPreOrders(userId?: number): Promise<PreOrder[]> {
    try {
      if (userId) {
        return await this.preOrderRepository.find({ 
          where: { userId }, 
          relations: ['product'] 
        });
      }
      return await this.preOrderRepository.find({ 
        relations: ['product'] 
      });
    } catch (error) {
      throw rpcError('Error finding pre-orders: ' + error.message);
    }
  }

  /**
   * Obtiene una pre-orden específica por ID
   */
  async findOnePreOrder(id: number): Promise<PreOrder> {
    try {
      const preOrder = await this.preOrderRepository.findOne({
        where: { id },
        relations: ['product']
      });

      if (!preOrder) {
        throw rpcError('Pre-order not found', 404);
      }

      return preOrder;
    } catch (error) {
      throw rpcError('Error finding pre-order: ' + error.message);
    }
  }

  /**
   * Elimina una pre-orden específica
   */
  async removePreOrder(id: number): Promise<PreOrder> {
    try {
      const preOrder = await this.preOrderRepository.findOne({
        where: { id },
        relations: ['product']
      });

      if (!preOrder) {
        throw rpcError('Pre-order not found', 404);
      }

      return await this.preOrderRepository.remove(preOrder);
    } catch (error) {
      throw rpcError('Error removing pre-order: ' + error.message);
    }
  }

  /**
   * Elimina pre-órdenes expiradas (más de 10 horas)
   */
  async deleteExpiredPreOrders(): Promise<void> {
    try {
      const limitDate = new Date();
      limitDate.setHours(limitDate.getHours() - 10); // 10 horas atrás

      const expiredPreOrders = await this.preOrderRepository.find({
        where: {
          createdAt: LessThan(limitDate),
        },
      });

      if (expiredPreOrders.length > 0) {
        this.logger.log(`Deleting ${expiredPreOrders.length} expired pre-orders`);
        await this.preOrderRepository.remove(expiredPreOrders);
      }
    } catch (error) {
      this.logger.error('Error deleting expired pre-orders:', error);
      throw rpcError('Error deleting expired pre-orders: ' + error.message);
    }
  }

  /**
   * Obtiene estadísticas de pre-órdenes
   */
  async getPreOrderStats(): Promise<{
    total: number;
    byUser: Record<number, number>;
    expired: number;
  }> {
    try {
      const total = await this.preOrderRepository.count();
      
      const byUser = await this.preOrderRepository
        .createQueryBuilder('preOrder')
        .select('preOrder.userId', 'userId')
        .addSelect('COUNT(*)', 'count')
        .groupBy('preOrder.userId')
        .getRawMany();

      const limitDate = new Date();
      limitDate.setHours(limitDate.getHours() - 10);
      
      const expired = await this.preOrderRepository.count({
        where: {
          createdAt: LessThan(limitDate),
        },
      });

      return {
        total,
        byUser: byUser.reduce((acc, item) => {
          acc[item.userId] = parseInt(item.count);
          return acc;
        }, {}),
        expired,
      };
    } catch (error) {
      throw rpcError('Error getting pre-order stats: ' + error.message);
    }
  }
}

