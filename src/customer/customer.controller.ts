import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AddToCartDto, PlaceOrderDto, UpdateProfileDto } from './customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('products')
  getProducts(@Query('category') category?: string) {
    return this.customerService.getProducts(category);
  }

  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.customerService.getProductById(id);
  }

  @Post('cart')
  addToCart(@Body() dto: AddToCartDto) {
    return this.customerService.addToCart(dto);
  }

  @Get('cart')
  getCart() {
    return this.customerService.getCart();
  }

  @Delete('cart/:id')
  removeCartItem(@Param('id') id: string) {
    return this.customerService.removeCartItem(id);
  }

  @Post('order')
  placeOrder(@Body() dto: PlaceOrderDto) {
    return this.customerService.placeOrder(dto);
  }

  @Get('orders')
  getOrders(@Query('status') status?: string) {
    return this.customerService.getOrders(status);
  }

  @Patch('profile')
  updateProfile(@Body() dto: UpdateProfileDto) {
    return this.customerService.updateProfile(dto);
  }
}
