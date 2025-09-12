import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { FacturaService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Controller()
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @MessagePattern({ facturas: 'create' })
  async create(@Payload() data: CreateFacturaDto) {
    try {
      return await this.facturaService.create(data);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        error: error.message || 'Error interno del servidor',
      });
    }
  }

  @MessagePattern({ facturas: 'findAll' })
  async findAll() {
    try {
      return await this.facturaService.findAll();
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        error: error.message || 'Error interno del servidor',
      });
    }
  }

  @MessagePattern({ facturas: 'find-by-id' })
  async findOne(@Payload() id: string) {
    try {
      return await this.facturaService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        error: error.message || 'Error interno del servidor',
      });
    }
  }

  @MessagePattern({ facturas: 'remove' })
  async remove(@Payload() id: string) {
    try {
      return await this.facturaService.remove(id);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        error: error.message || 'Error interno del servidor',
      });
    }
  }
}