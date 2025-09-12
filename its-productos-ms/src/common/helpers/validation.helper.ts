import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestException, Logger } from '@nestjs/common';

const logger = new Logger('ValidationHelper');

export async function validateDto<T>(
  dtoClass: new () => T,
  data: any,
  context?: string,
): Promise<T> {
  try {
    // Transformar los datos al DTO
    const dto = plainToClass(dtoClass, data, {
      enableImplicitConversion: true,
    });

    // Validar el DTO
    const errors = await validate(dto as any, {
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

      logger.warn(`Validation failed${context ? ` in ${context}` : ''}:`, errorMessages);
      
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
        statusCode: 400,
      });
    }

    return dto;
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    
    logger.error(`Validation error${context ? ` in ${context}` : ''}:`, error);
    throw new BadRequestException('Invalid data format');
  }
}

export function validateId(id: any, fieldName: string = 'id'): number {
  const numId = Number(id);
  
  if (isNaN(numId) || numId <= 0) {
    throw new BadRequestException(`${fieldName} must be a positive number`);
  }
  
  return numId;
}

export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new BadRequestException(`${fieldName} is required`);
  }
}

