import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USERS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { handleRpcResponse } from 'src/common/helpers/rpc-error.helper';
import { JwtPayload } from './interfaces/jwt-payload.interface';

/**
 * Authentication Service
 * Handles JWT token generation, verification, and user validation
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  /**
   * Generates a JWT token from the payload
   * @param payload - The payload to sign
   * @returns Promise<string> - The signed JWT token
   */
  async signToken(payload: PayloadInterface): Promise<string> {
    const jwtPayload: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    };

    return this.jwtService.signAsync(jwtPayload);
  }

  /**
   * Verifies and decodes a JWT token
   * @param token - The JWT token to verify
   * @returns Promise<JwtPayload> - The decoded token payload
   * @throws UnauthorizedException if token is invalid
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Validates user credentials through the user microservice
   * @param email - User email
   * @param password - User password
   * @returns Promise<PayloadInterface> - The validated user payload
   * @throws UnauthorizedException if credentials are invalid
   */

  async validateUser(
    email: string,
    password: string,
  ): Promise<PayloadInterface> {
    try {
      const user: unknown = await handleRpcResponse(this.userClient, 'login', {
        email,
        password,
      });

      this.logger.log(`User ${email} validated successfully`);
      return user as PayloadInterface;
    } catch (error) {
      this.logger.error(`User validation failed for ${email}:`, error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Generates a complete token response
   * @param user - The user payload
   * @returns Promise<{access_token: string}> - The token response
   */

  async generateToken(
    user: PayloadInterface,
  ): Promise<{ access_token: string }> {
    const token = await this.signToken(user);
    return { access_token: token };
  }
}
