import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport} from '@nestjs/microservices';
import { envs, PRODUCTS_SERVICE } from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      { 
        name: PRODUCTS_SERVICE, 
        transport: Transport.TCP, 
        options: { 
          host: envs.PRODUCTS_MICROSERVICE_HOST,
          port: envs.PRODUCTS_MICROSERVICE_PORT,
        },
      }
    ]),
  ],
})
export class ProductsModule {}
