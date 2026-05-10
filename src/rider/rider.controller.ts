import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { JwtAuthGuard } from './jwt-auth.guard';

import { RiderService } from './rider.service';

import {
  CreateRiderDto,
  riderLoginDto,
} from './rider.dto';

import {
  Rider,
  RiderStatus,
} from './rider.entity';

import { CreateReviewDto } from './review.dto';
import { Review } from './review.entity';

import { UpdateOrderStatusDto } from './update-order-status.dto';

@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  // =========================================
  // CREATE RIDER (WITH PROFILE IMAGE UPLOAD)
  // =========================================
  @Post('createRider')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/riders',

        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(
            null,
            `${unique}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  createRider(
    @Body() dto: CreateRiderDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ): Promise<Rider> {
    if (profileImage) {
      (dto as any).profileImage = profileImage.filename;
    }

    return this.riderService.createRider(dto);
  }

  // =========================================
  // LOGIN
  // =========================================
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() dto: riderLoginDto) {
    return this.riderService.login(dto);
  }

  // =========================================
  // CHANGE STATUS
  // =========================================
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: RiderStatus,
  ) {
    return this.riderService.changeStatus(id, status);
  }

  // =========================================
  // GET AVAILABLE RIDERS
  // =========================================
  @Get('available')
  getAvailable() {
    return this.riderService.getAvailable();
  }

  // =========================================
  // GET ALL RIDERS
  // =========================================
  @Get('all-riders')
  @UseGuards(JwtAuthGuard)
  getAllRiders() {
    return this.riderService.getAllRiders();
  }

  // =========================================
  // GET RIDER BY ID
  // =========================================
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getRider(@Param('id', ParseIntPipe) id: number) {
    return this.riderService.getRider(id);
  }

  // =========================================
  // UPDATE RIDER (WITH IMAGE)
  // =========================================
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/riders',
        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(
            null,
            `${unique}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  updateRider(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRiderDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    if (profileImage) {
      (dto as any).profileImage = profileImage.filename;
    }

    return this.riderService.updateRider(id, dto);
  }

  // =========================================
  // DELETE RIDER
  // =========================================
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteRider(@Param('id', ParseIntPipe) id: number) {
    return this.riderService.deleteRider(id);
  }

  // =========================================
  // ADD REVIEW
  // =========================================
  @Post(':id/review')
  @UseGuards(JwtAuthGuard)
  addReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.riderService.addReview(id, dto);
  }

  // =========================================
  // GET REVIEWS
  // =========================================
  @Get(':id/reviews')
  @UseGuards(JwtAuthGuard)
  getReviews(@Param('id', ParseIntPipe) id: number) {
    return this.riderService.getReviews(id);
  }

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================
  @Patch(':id/order-status')
  @UseGuards(JwtAuthGuard)
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.riderService.updateOrderStatus(
      id,
      dto.status,
      dto.riderId,
    );
  }
}