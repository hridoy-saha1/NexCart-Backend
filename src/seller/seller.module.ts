// import { Module } from '@nestjs/common';
// import { SellerController } from './seller.controller';
// import { SellerService } from './seller.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { SellerEntity } from './seller.entity';
// import { ProductEntity } from './product.entity';
// import { SellerShopEntity } from './seller-shop.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([SellerEntity, ProductEntity, SellerShopEntity]),
//   ],
//   controllers: [SellerController],
//   providers: [SellerService],
// })
// export class SellerModule {}

import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './seller.entity';
import { ProductEntity } from './product.entity';
import { SellerShopEntity } from './seller-shop.entity';
// ✅ IMPORT MAILER
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'mySecretKey', // 🔁 use env later
      signOptions: { expiresIn: '1h' },
    }),
    // ✅ LOAD ENV FILE
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([SellerEntity, ProductEntity, SellerShopEntity]),

    // ✅ ADD THIS BLOCK
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
  controllers: [SellerController],
  providers: [SellerService, JwtStrategy],
})
export class SellerModule {}
