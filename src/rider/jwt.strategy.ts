import {Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RiderService } from './rider.service';     
import { validate } from 'class-validator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly riderService: RiderService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'mySecretKey',
    });
  }
     

async validate(payload: any) {          
    return {
        id: payload.sub,
        email: payload.email,
    }
    }  
}