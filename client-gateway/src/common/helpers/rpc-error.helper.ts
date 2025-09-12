import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcResponse } from './rpc-response.interface';

export async function handleRpcResponse(
  client: ClientProxy,
  pattern: any,
  data: any,
) {
  return await lastValueFrom(
    client.send(pattern, data).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    ),
  );
}
