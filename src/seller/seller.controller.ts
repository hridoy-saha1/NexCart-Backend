import { HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

//new
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { SellerService } from './seller.service';
import { SellerRegistrationDto, UpdateSellerDto, LoginDto } from './seller.dto';
import { CreateProductDto, UpdateProductDto } from './product.dto';

import { CreateSellerShopDto, UpdateSellerShopDto } from './seller-shop.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  ///////

  @Post(':sellerId/products')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createProductForSeller(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @Body() dto: CreateProductDto,
  ) {
    return this.sellerService.createProductForSeller(sellerId, dto);
  }

  @Get(':sellerId/products')
  getProductsBySeller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.sellerService.getProductsBySeller(sellerId);
  }

  @Post(':sellerId/shop')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createSellerShop(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @Body() dto: CreateSellerShopDto,
  ) {
    return this.sellerService.createSellerShop(sellerId, dto);
  }
  //////

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseInterceptors(
    FileInterceptor('nidImage', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/i)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only image files (jpg, jpeg, png, webp) are allowed',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  createSeller(
    @Body() dto: SellerRegistrationDto,
    @UploadedFile() nidImage: Express.Multer.File,
  ) {
    return this.sellerService.createSeller(dto, nidImage);
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  login(@Body() dto: LoginDto) {
    return this.sellerService.loginSeller(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllSellers() {
    return this.sellerService.getAllSellers();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSellerDto,
  ) {
    return this.sellerService.updateSeller(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteSeller(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.deleteSeller(id);
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createProduct(@Body() dto: CreateProductDto) {
    return this.sellerService.createProduct(dto);
  }

  @Get('products')
  getAllProducts() {
    return this.sellerService.getAllProducts();
  }

  @Get('products/:id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.getProductById(id);
  }

  // @Put('products/:id')
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  // replaceProduct(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: UpdateProductDto,
  // ) {
  //   return this.sellerService.replaceProduct(id, dto);
  // }

  @Patch('products/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.sellerService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.deleteProduct(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getSellerById(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.getSellerById(id);
  }

  //
}
