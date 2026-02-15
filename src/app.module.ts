import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { SellerModule } from './seller/seller.module';
@Module({
  imports: [CustomerModule, SellerModule],
})
export class AppModule {}
