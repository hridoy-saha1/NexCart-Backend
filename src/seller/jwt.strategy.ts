// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: 'mySecretKey',
//     });
//   }

//   async validate(payload: any) {
//     return {
//       userId: payload.sub,
//       email: payload.email,
//     };
//   }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'seller-jwt') {
  constructor() {
    const key = process.env.JWT_SECRET;

    if (!key) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: key,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    if (payload.role !== 'seller') {
      throw new UnauthorizedException('Seller token required');
    }

    return {
      id: payload.sub,
      sellerId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}