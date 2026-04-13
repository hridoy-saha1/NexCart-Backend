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
import { SellerEntity } from './entities/seller.entity';
import { ProductEntity } from './entities/product.entity';
import { SellerShopEntity } from './entities/seller-shop.entity';
//  IMPORT MAILER
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from './modules/mail.module';

@Module({
  imports: [
    //  LOAD ENV FILE
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),

    //  MAILER
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: process.env.MAIL_USER,
    //       pass: process.env.MAIL_PASS,
    //     },
    //   },
    // }),
    MailModule,
    JwtModule.register({
      secret: 'mySecretKey', //
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([SellerEntity, ProductEntity, SellerShopEntity]),
  ],
  controllers: [SellerController],
  providers: [SellerService, JwtStrategy],
})
export class SellerModule {}
