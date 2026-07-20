// import { AuthGuard } from '@nestjs/passport';

// export class JwtAuthGuard extends AuthGuard('jwt') {}

import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('seller-jwt') {
  handleRequest(err, user, info) {
    console.error('SELLER AUTH DEBUG:', {
      hasError: Boolean(err),
      hasUser: Boolean(user),
      infoMessage: info?.message,
      infoName: info?.name,
      user,
    });

    if (err || !user) {
      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }

    return user;
  }
}