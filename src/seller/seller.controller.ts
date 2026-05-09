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
  ParseIntPipe,
  BadRequestException,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { SellerService } from './seller.service';
import { JwtAuthGuard } from './jwt-auth.guard';

import {
  SellerRegistrationDto,
  UpdateSellerDto,
  LoginDto,
} from './dtos/seller.dto';

import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { CreateSellerShopDto } from './dtos/seller-shop.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

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

  @Get('products')
  getAllProducts() {
    return this.sellerService.getAllProducts();
  }

  @Get('products/:id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.getProductById(id);
  }

  @Post(':sellerId/products')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseInterceptors(
    FileInterceptor('productImage', {
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
        destination: './uploads/products',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  createProductForSeller(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @Body() dto: CreateProductDto,
    @UploadedFile() productImage: Express.Multer.File,
  ) {
    return this.sellerService.createProductForSeller(
      sellerId,
      dto,
      productImage,
    );
  }

  @Get(':sellerId/products')
  getProductsBySeller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.sellerService.getProductsBySeller(sellerId);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseInterceptors(
    FileInterceptor('productImage', {
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
        destination: './uploads/products',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFile() productImage?: Express.Multer.File,
  ) {
    return this.sellerService.updateProduct(id, dto, productImage);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.deleteProduct(id);
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  updateSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSellerDto,
    @UploadedFile() nidImage?: Express.Multer.File,
  ) {
    return this.sellerService.updateSeller(id, dto, nidImage);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteSeller(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.deleteSeller(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getSellerById(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.getSellerById(id);
  }
}
