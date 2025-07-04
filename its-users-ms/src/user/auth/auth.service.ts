import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

 constructor(private readonly jwtService: JwtService) {}

    hashPassword(password: string): Promise<string> {
        const saltOrRounds = 12;
        return bcrypt.hash(password, saltOrRounds);
    }
    
    compararPassword(
        password: string,
        hashPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashPassword);
    }

}