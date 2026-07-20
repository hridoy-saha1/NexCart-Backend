// import { AuthGuard } from '@nestjs/passport';

// export class JwtAuthGuard extends AuthGuard('jwt') {}

import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('seller-jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('SELLER AUTH ERROR:', {
        err,
        infoMessage: info?.message,
        infoName: info?.name,
      });

      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }

    return user;
  }
}
