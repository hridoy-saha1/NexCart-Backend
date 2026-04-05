// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AdminModule } from './admin/admin.module';
// import { CustomerModule } from './customer/customer.module';
// import { SellerModule } from './seller/seller.module';
// import { RiderModule } from './rider/rider.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// @Module({
//   imports: [AdminModule, CustomerModule, SellerModule, RiderModule,TypeOrmModule.forRoot(
// { type: 'postgres',
// host: 'localhost',
// port: 5432,
// username: 'postgres',
// password: 'postgres',
// database: 'DiptaDB',//Change to your database name
// autoLoadEntities: true,
// synchronize: true,
// } ),],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { SellerModule } from './seller/seller.module';
import { RiderModule } from './rider/rider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    AdminModule,
    CustomerModule,
    SellerModule,
    RiderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
