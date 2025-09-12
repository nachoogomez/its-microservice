import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config';
import { JwtPayload, ValidatedUser } from '../interfaces/jwt-payload.interface';

/**
 * JWT Strategy for Passport authentication
 * Validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.JWT_SECRET,
      algorithms: ['HS256'], // Especifica el algoritmo HS256
    });
  }

  /**
   * Validates the JWT payload and returns user information
   * @param payload - The decoded JWT payload
   * @returns ValidatedUser - The validated user object
   * @throws UnauthorizedException if payload is invalid
   */

  validate(payload: JwtPayload): ValidatedUser {
    if (!payload.sub || !payload.email || !payload.name) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new UnauthorizedException('Token expired');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
