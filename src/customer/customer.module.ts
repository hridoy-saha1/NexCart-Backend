import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { customerEntity } from './customer.entity';
import { ProductEntity } from 'src/seller/product.entity';
import { CartItem } from './cart-item.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      customerEntity,
      ProductEntity,
      CartItem, // 🔹 Must add this
      Order,
      OrderItem,
    ]),
    JwtModule.register({
      secret: 'SECRET_KEY', // same as jwt.strategy
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
