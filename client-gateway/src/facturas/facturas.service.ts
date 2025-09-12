import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class FacturasService {
  constructor(@Inject('MS_FACTURA') private readonly client: ClientProxy) {}

  crearFactura(dto: any) {
    return this.client.send('crear-factura', dto);
  }

  obtenerFacturasDeUsuario(usuarioId: string) {
    return this.client.send('obtener-facturas-usuario', usuarioId);
  }
}
