import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateOrderStatusDto,
  PayoutRequestDto,
} from './seller.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  //Create Product
  @Post('product/create')
  createProduct(@Body() obj: CreateProductDto): object {
    console.log(obj);
    return this.sellerService.createProduct(obj);
  }

  //Update Product
  @Patch('product/update/:id')
  updateProduct(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): object {
    return this.sellerService.updateProduct(id, dto);
  }

  // Delete Product
  @Delete('product/delete/:id')
  deleteProduct(@Param('id') id: number): object {
    return this.sellerService.deleteProduct(id);
  }

  //Get  Products
  @Get('products')
  getMyProducts(): object {
    return this.sellerService.getMyProducts();
  }

  //Get Orders
  @Get('orders')
  getIncomingOrders(): object {
    return this.sellerService.getIncomingOrders();
  }

  //Update Order Status
  @Patch('orders/update-status/:id')
  updateOrderStatus(
    @Param('id') id: number,
    @Body() dto: UpdateOrderStatusDto,
  ): object {
    return this.sellerService.updateOrderStatus(id, dto);
  }

  //Sales Analytics
  @Get('analytics')
  getSalesAnalytics(): object {
    return this.sellerService.getSalesAnalytics();
  }

  //  Request Payout
  @Post('payout/request')
  requestPayout(@Body() dto: PayoutRequestDto): object {
    return this.sellerService.requestPayout(dto);
  }
}
