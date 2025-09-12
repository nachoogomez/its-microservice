import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { FacturaService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Controller()
export class FacturaController {
  private readonly logger = new Logger(FacturaController.name);

  constructor(private readonly facturaService: FacturaService) {}

  @MessagePattern({ facturas: 'create' })
  async create(@Payload() data: CreateFacturaDto) {
    this.logger.log(`Recibida solicitud de creación de factura para cliente: ${data.cliente}`);
    
    try {
      const result = await this.facturaService.create(data);
      this.logger.log(`Factura creada exitosamente con ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error en creación de factura: ${error.message}`, error.stack);
      
      const statusCode = error.status || error.statusCode || 500;
      const message = error.message || 'Error interno del servidor';
      
      throw new RpcException({
        statusCode,
        error: message,
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