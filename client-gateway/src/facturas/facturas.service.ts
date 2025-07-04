import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FACTURAS_SERVICE } from 'src/config';

@Injectable()
export class FacturasService {
  constructor(
    @Inject(FACTURAS_SERVICE) private readonly client: ClientProxy,
  ) {}

  crearFactura(dto: any) {
    return this.client.send('crear-factura', dto);
  }

  obtenerFacturasDeUsuario(usuarioId: string) {
    return this.client.send('obtener-facturas-usuario', usuarioId);
  }
}