import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<any> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // Si ya es una RpcException, la devolvemos
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    // Para otros tipos de errores, los convertimos a RpcException
    const error = {
      statusCode: exception.status || 500,
      message: exception.message || 'Internal server error',
      error: exception.name || 'InternalServerError',
      timestamp: new Date().toISOString(),
      service: 'products-microservice'
    };

    return throwError(() => error);
  }
}
