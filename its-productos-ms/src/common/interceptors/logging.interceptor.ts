import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const pattern = rpcContext.getContext();
    const data = rpcContext.getData();
    
    const startTime = Date.now();
    
    this.logger.log(`📥 Incoming RPC: ${JSON.stringify(pattern)} - Data: ${JSON.stringify(data)}`);

    return next.handle().pipe(
      tap((response) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        this.logger.log(`📤 RPC Response: ${JSON.stringify(pattern)} - Duration: ${duration}ms`);
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        this.logger.error(`❌ RPC Error: ${JSON.stringify(pattern)} - Duration: ${duration}ms - Error: ${error.message}`);
        throw error;
      }),
    );
  }
}
