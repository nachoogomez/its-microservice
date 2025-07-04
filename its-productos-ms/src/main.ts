import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

 async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: envs.MS_PRODUCT_HOST,
      port: envs.MS_PRODUCT_PORT,
    },
  });

   app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }
    ));

  await app.listen();
  console.log(`Products microservice running on port ${envs.MS_PRODUCT_PORT}`);
}
bootstrap();


