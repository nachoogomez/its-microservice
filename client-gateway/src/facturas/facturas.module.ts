import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config';

@Module({
  controllers: [FacturasController],
  providers: [FacturasService],
  imports: [
    ClientsModule.register([
      {
        name: 'MS_FACTURA',
        transport: Transport.TCP,
        options: {
          host: envs.FACTURAS_MICROSERVICE_HOST,
          port: envs.FACTURAS_MICROSERVICE_PORT,
        },
      },
      {
        name: 'MS_USER',
        transport: Transport.TCP,
        options: {
          host: envs.USERS_MICROSERVICE_HOST,
          port: envs.USERS_MICROSERVICE_PORT 
        },
      },
    ]),
  ],
})
export class FacturasModule {}
