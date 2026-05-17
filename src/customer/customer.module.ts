import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { customerEntity } from './customer.entity';
import { ProductEntity } from 'src/seller/entities/product.entity';
import { CartItem } from './cart-item.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

// ✅ MAILER + ENV
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { PassportModule } from '@nestjs/passport';
import Pusher from 'pusher';
import { PusherModule } from 'src/pusher/pusher.module';

@Module({
  imports: [
    // ✅ ENV CONFIG
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ DATABASE ENTITIES
    TypeOrmModule.forFeature([
      customerEntity,
      ProductEntity,
      CartItem,
      Order,
      OrderItem,
    ]),

    PusherModule,

    // ✅ JWT
    PassportModule,
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '1h' },
    }),

    // ✅ MAILER CONFIG (SAME AS SELLER)
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
  ],

  controllers: [CustomerController],

  providers: [CustomerService, JwtStrategy, MailService],
})
export class CustomerModule {}
