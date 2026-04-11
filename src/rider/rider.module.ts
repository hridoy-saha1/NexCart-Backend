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

@Module({
  imports: [
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Rider,Review,Order,Delivery])],
  controllers: [RiderController,],
  providers: [RiderService, JwtStrategy],
})
export class RiderModule {}