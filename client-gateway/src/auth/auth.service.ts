import { Injectable, Inject } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { USERS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { handleRpcResponse } from 'src/common/helpers/rpc-error.helper';

@Injectable()
export class AuthService {
 constructor(
  private readonly jwtService: JwtService,
  @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
 ) {}

 async singToker(payload: PayloadInterface) {
  return this.jwtService.sign(payload);
 }

 async verifyToken(token: string): Promise<PayloadInterface> {
    return this.jwtService.verifyAsync(token);
  }

  async validateUser (email: string, password: string): Promise<PayloadInterface> {
    try {
      const user = await handleRpcResponse(
        this.userClient,
        'login',
        { email, password },
      );
      return user as PayloadInterface;
    } catch (error) {
      console.error('Error validating user:', error);
      throw error;
    }
  }

  async generateToken(user: PayloadInterface){

    const token = await this.singToker(user);
    return {access_token: token};
  }
}
