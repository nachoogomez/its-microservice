import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcResponse } from '../../common/interfaces/rpc-response.interface';

export function rpcError(
  errorMessage: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
): RpcException {
  const error: RpcResponse = {
    statusCode,
    error: errorMessage,
  };

  return new RpcException(error);
}