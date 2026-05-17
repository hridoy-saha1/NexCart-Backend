import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rider } from './rider.entity';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { Review } from './review.entity';
import { Order } from 'src/customer/order.entity';
import { Delivery } from './delivery.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { PusherModule } from 'src/pusher/pusher.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Rider, Review, Order, Delivery]),
    PusherModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
          user: process.env.Email,
          pass: process.env.EmailPassword,
        },
      },
    }),
  ],
  controllers: [RiderController],
  providers: [RiderService, JwtStrategy],
})
export class RiderModule {}
