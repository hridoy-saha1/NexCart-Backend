import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './seller.entity';
import { ProductEntity } from './product.entity';
import { SellerShopEntity } from './seller-shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerEntity, ProductEntity, SellerShopEntity]),
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
