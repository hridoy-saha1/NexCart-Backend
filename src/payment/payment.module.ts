import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Order } from '../customer/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
