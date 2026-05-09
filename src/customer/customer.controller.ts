import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Put,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateProfileDto } from './customer.dto';

import { customerEntity } from './customer.entity';
import { ProductEntity } from 'src/seller/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  createUser(@Body() dto: CreateCustomerDto): Promise<customerEntity> {
    return this.customerService.createUser(dto);
  }
  @Post('login')
  login(@Body() body): Promise<any> {
    return this.customerService.login(body);
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    console.log('🔥 CONTROLLER HIT');
    console.log('🔥 REQ USER:', req.user);
    return this.customerService.getProfile(req.user.id);
  }
  @Get('products')
  @UseGuards(JwtAuthGuard)
  getAllProducts(): Promise<ProductEntity[]> {
    return this.customerService.getAllProducts();
  }
  @Put('profile/:id')
  @UseInterceptors(
    FileInterceptor('profilePic', {
      storage: diskStorage({
        destination: './uploads/profile', // folder to save images
        filename: (req, file, cb) => {
          const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
          return cb(
            new BadRequestException('Only JPG files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.customerService.updateProfile(id, dto, file);
  }
  @Get('products/:id')
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.customerService.getProductById(id);
  }

  @Get('products/search/:name')
  searchProduct(@Param('name') name: string): Promise<ProductEntity[]> {
    return this.customerService.searchProduct(name);
  }
  //Relationship start
  @Post('cart/:customerId/:productId')
  addToCart(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.customerService.addToCart(customerId, productId);
  }

  // Place order
  @Post('orders/:customerId')
  placeOrder(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body('paymentMethod') paymentMethod: string,
  ) {
    return this.customerService.placeOrder(customerId, paymentMethod);
  }

  // Get all orders
  @Get('orders-details')
  getOrders() {
    return this.customerService.getOrderDetails();
  }

  // Update order status
  @Patch('orders/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.customerService.updateOrderStatus(id, status);
  }
}
