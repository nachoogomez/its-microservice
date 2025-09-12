import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ValidationInterceptor.name);

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const handler = context.getHandler();
    const data = context.switchToRpc().getData();
    
    // Obtener el DTO del handler si está definido
    const dtoClass = this.getDtoClass(handler);
    
    if (dtoClass && data) {
      try {
        // Transformar y validar los datos
        const dto = plainToClass(dtoClass, data, {
          enableImplicitConversion: true,
        });
        
        const errors = await validate(dto, {
          whitelist: true,
          forbidNonWhitelisted: true,
          stopAtFirstError: true,
        });

        if (errors.length > 0) {
          const errorMessages = errors.map(error => ({
            property: error.property,
            value: error.value,
            constraints: error.constraints,
          }));

          this.logger.warn('Validation failed:', errorMessages);
          
          throw new BadRequestException({
            message: 'Validation failed',
            errors: errorMessages,
            statusCode: 400,
          });
        }

        // Los datos ya están validados, continuar con el flujo normal
      } catch (error) {
        this.logger.error('Validation error:', error);
        throw error;
      }
    }

    return next.handle();
  }

  private getDtoClass(handler: any): any {
    // Esta es una implementación básica
    // En un caso real, podrías usar metadatos o decoradores personalizados
    // para identificar el DTO correcto para cada handler
    
    // Por ahora, retornamos null para que no interfiera
    // La validación se puede hacer manualmente en cada servicio
    return null;
  }
}
