import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
        host: envs.FACTURAS_HOST,
      port: envs.FACTURAS_PORT,
    },
  });
  await app.listen();

  const logger = new Logger ('FacturasMS');

  logger.log(`Facturas microservice running on port ${envs.FACTURAS_PORT}`);
}
bootstrap();


