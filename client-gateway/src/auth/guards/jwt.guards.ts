import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * JWT Authentication Guard
 * Protects routes by validating JWT tokens
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('GUARD_KEY', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * Handles the request after JWT validation
   * @param err - Any error that occurred during validation
   * @param user - The validated user object
   * @returns any - The validated user object (typed as any for compatibility)
   * @throws UnauthorizedException if authentication fails
   */
  handleRequest(err: any, user: any): any {
    if (err) {
      this.logger.error('JWT authentication error:', err instanceof Error ? err.message : String(err));
      throw new UnauthorizedException('Authentication failed');
    }

    if (!user) {
      this.logger.warn('JWT authentication failed: No user found');
      throw new UnauthorizedException('Invalid or expired token');
    }

    this.logger.debug(`User authenticated: ${user.email || 'unknown'}`);
    return user;
  }
}
