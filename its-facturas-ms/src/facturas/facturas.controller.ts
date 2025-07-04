import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacturaService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Controller()
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @MessagePattern({ facturas: 'create' })
  create(@Payload() data: CreateFacturaDto) {
    return this.facturaService.create(data);
  }

  @MessagePattern({ facturas: 'findAll' })
  findAll() {
    return this.facturaService.findAll();
  }

  @MessagePattern({ facturas: 'findOne' })
  findOne(@Payload() id: string) {
    return this.facturaService.findOne(id);
  }

  @MessagePattern({ facturas: 'remove' })
  remove(@Payload() id: string) {
    return this.facturaService.remove(id);
  }
}