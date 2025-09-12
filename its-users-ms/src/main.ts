import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('User Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: envs.AUTH_HOST,
        port: envs.AUTH_PORT,
      },
    },
  );

  await app.listen();
  logger.log(`Auth microservice is running on port ${envs.AUTH_PORT}`);
}
bootstrap();
