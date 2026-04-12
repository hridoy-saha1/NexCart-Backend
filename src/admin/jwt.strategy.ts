import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const key = process.env.JWT_SECRET;

    if (!key) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      // jsonWebTokenOptions: {
      //   ignoreNotBefore: true, // Ignore "nbf" claim to prevent "Token not active" errors
      // },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: key,
    });
  }

  async validate(payload: any) {
    return {
      adminId: payload.sub,
      email: payload.email,
    };
  }
}
