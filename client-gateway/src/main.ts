import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('ClientGateway');

  const app = await NestFactory.create(AppModule);

  // Configurar prefijo global
  app.setGlobalPrefix('api');

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      // Transformar automáticamente los tipos de datos
      transform: true,

      // Solo permitir propiedades que estén definidas en el DTO
      whitelist: true,

      // Rechazar propiedades que no estén en el DTO
      forbidNonWhitelisted: true,

      // Detener en el primer error de validación
      stopAtFirstError: true,

      // Transformar objetos anidados
      transformOptions: {
        enableImplicitConversion: true,
      },

      // Personalizar mensajes de error
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        }));

        logger.error('Validation failed:', result);

        return new BadRequestException({
          message: 'Validation failed',
          errors: result,
          statusCode: 400,
        });
      },
    }),
  );

  // Configurar filtro de excepciones global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar interceptor de transformación global
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configurar CORS
  app.enableCors({
    origin: true, // Permitir todos los orígenes en desarrollo
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Configurar límites de tamaño de payload
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ extended: true, limit: '10mb' }));

  await app.listen(envs.PORT);

  logger.log(`Client Gateway is running on port ${envs.PORT}`);
  logger.log(`Environment: ${envs.NODE_ENV}`);
  logger.log(`CORS enabled for origins: ${envs.ALLOWED_ORIGINS}`);
}
bootstrap();
