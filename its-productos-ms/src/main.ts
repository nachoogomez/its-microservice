import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('ProductsMicroservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: envs.MS_PRODUCT_HOST,
      port: envs.MS_PRODUCT_PORT,
    },
  });

  // Configurar filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configurar interceptor global de logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configurar ValidationPipe global para microservicio
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        }));
        
        logger.error('Validation failed in microservice:', result);
        
        return new BadRequestException({
          message: 'Validation failed',
          errors: result,
          statusCode: 400,
        });
      },
    }),
  );

  // Configurar logging
  app.useLogger(logger);

  await app.listen();
  
  logger.log(`Products microservice running on ${envs.MS_PRODUCT_HOST}:${envs.MS_PRODUCT_PORT}`);
}
bootstrap();


