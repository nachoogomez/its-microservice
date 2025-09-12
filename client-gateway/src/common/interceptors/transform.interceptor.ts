import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    this.logger.log(`${method} ${url} - Request started`);

    return next.handle().pipe(
      map((data) => {
        const responseTime = Date.now() - now;

        this.logger.log(
          `${method} ${url} - Response sent in ${responseTime}ms`,
        );

        return {
          data,
          message: 'Success',
          statusCode: 200,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
