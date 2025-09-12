import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PreOrdersService } from './preorders.service';
import { CreatePreOrderDto } from './dto/create-preorder.dto';

@Controller()
export class PreOrdersController {
  constructor(private readonly preOrdersService: PreOrdersService) {}

  @MessagePattern('createPreOrder')
  createPreOrder(@Payload() dto: CreatePreOrderDto) {
    return this.preOrdersService.createPreOrder(dto);
  }

  @MessagePattern('confirmPurchase')
  confirmPurchase(@Payload() payload: { userId: number }) {
    return this.preOrdersService.confirmPurchase(payload.userId);
  }

  @MessagePattern('findAllPreOrder')
  findAllPreOrders(@Payload() payload: { userId?: number }) {
    return this.preOrdersService.findAllPreOrders(payload.userId);
  }

  @MessagePattern('findOnePreOrder')
  findOnePreOrder(@Payload() payload: { id: number }) {
    return this.preOrdersService.findOnePreOrder(payload.id);
  }

  @MessagePattern('removePreOrder')
  removePreOrder(@Payload() payload: { id: number }) {
    return this.preOrdersService.removePreOrder(payload.id);
  }

  @MessagePattern('getPreOrderStats')
  getPreOrderStats() {
    return this.preOrdersService.getPreOrderStats();
  }

  @MessagePattern('deleteExpiredPreOrders')
  deleteExpiredPreOrders() {
    return this.preOrdersService.deleteExpiredPreOrders();
  }
}

