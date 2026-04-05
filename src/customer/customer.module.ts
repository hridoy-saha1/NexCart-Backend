import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { customerEntity } from './customer.entity';
import { ProductEntity } from 'src/seller/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([customerEntity, ProductEntity])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
