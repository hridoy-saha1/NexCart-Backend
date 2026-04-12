import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // 'info' contains the specific error (e.g., "TokenExpiredError")
    if (err || !user) {
      console.error('Auth Error:', info);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
