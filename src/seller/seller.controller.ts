import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Res,
  NotFoundException,
} from '@nestjs/common';

import type { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

import { SellerService } from './seller.service';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateOrderStatusDto,
  PayoutRequestDto,
  SellerRegistrationDto,
} from './seller.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // Seller Registration (User Category 1)
  @Post('/register')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('nidImage', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/i)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // ✅ 2MB
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  registerSeller(
    @Body() dto: SellerRegistrationDto,
    @UploadedFile() nidImage: Express.Multer.File,
  ): object {
    console.log(dto, nidImage); //for my checking
    return this.sellerService.registerSeller(dto, nidImage);
  }

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

  //  Show image
  @Get('image/:img')
  getImage(@Param('img') img: string, @Res() res: Response) {
    const imagePath = join(process.cwd(), 'uploads', img);

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Image not found');
    }
    return res.sendFile(imagePath);
  }

  @Get('/getimage/:name')
  getImages(@Param('name') name, @Res() res) {
    res.sendFile(name, { root: './uploads' });
  }
}
