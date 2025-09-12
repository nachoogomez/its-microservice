import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidatedUser } from 'src/auth/interfaces/jwt-payload.interface';

/**
 * Custom decorator to extract the authenticated user from the request
 * @param data - Optional data parameter (not used)
 * @param ctx - The execution context
 * @returns ValidatedUser - The authenticated user object
 */

export const Usuario = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ValidatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as ValidatedUser;
  },
);
