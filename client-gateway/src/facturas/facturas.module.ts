import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturaController } from './facturas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { envs } from 'src/config';

@Module({
  controllers: [FacturaController],
  providers: [FacturasService],
  exports: [FacturasService],
  imports: [
    AuthModule,
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
          port: envs.USERS_MICROSERVICE_PORT,
        },
      },
      {
        name: 'MS_PRODUCTOS',
        transport: Transport.TCP,
        options: {
          host: envs.PRODUCTS_MICROSERVICE_HOST,
          port: envs.PRODUCTS_MICROSERVICE_PORT,
        },
      },
    ]),
  ],
})
export class FacturasModule {}
