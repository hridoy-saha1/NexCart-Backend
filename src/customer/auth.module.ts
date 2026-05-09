import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CustomerService } from './customer.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // PassportModule,
    JwtModule.register({
      secret: 'hridoy', // change to env variable for production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [CustomerService, JwtStrategy],
  // exports: [JwtModule, PassportModule],
})
export class AuthModule {}
