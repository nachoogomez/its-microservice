export interface RpcResponse<T = any> {
  statusCode: number;
  data?: T;
  error?: string;
}
