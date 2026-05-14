import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Rider } from 'src/rider/rider.entity';
import { Order } from 'src/customer/order.entity';
import { PusherModule } from 'src/pusher/pusher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity, Rider, Order]),
    PusherModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
