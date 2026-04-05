import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './seller.entity';
import { ProductEntity } from './product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerEntity, ProductEntity])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
