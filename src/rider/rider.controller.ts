
import {
  UseGuards,
}
from '@nestjs/common';

import {JwtAuthGuard} from './jwt-auth.guard';

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  BadRequestException
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { Rider } from './rider.entity';
import { CreateRiderDto,riderLoginDto } from './rider.dto';
import { CreateReviewDto } from './review.dto';
import { Review } from './review.entity';
import { UpdateOrderStatusDto } from './update-order-status.dto';




@Controller('riders')
export class RiderController {

  constructor(private readonly riderService: RiderService) {}

  @Post('createRider')
  @UsePipes(new ValidationPipe())
  createRider(@Body() dto: CreateRiderDto): Promise<Rider> {
    return this.riderService.createRider(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() dto: riderLoginDto): Promise<object> {
    return this.riderService.login(dto);
  }


  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ): Promise<Rider> {

    if (status !== 'available' && status !== 'busy' && status !== 'offline') {
      throw new BadRequestException('Status must be "available", "busy" or "offline"');
    }

    return this.riderService.changeStatus(id, status);
  }

  @Get('available')
  getAvailable(): Promise<Rider[]> {
    return this.riderService.getAvailable();
  }

  @Get('all-riders')
  @UseGuards(JwtAuthGuard)
  getAllRiders(): Promise<Rider[]> {
    return this.riderService.getAllRiders();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getRider(@Param('id', ParseIntPipe) id: number): Promise<Rider> {
    return this.riderService.getRider(id);
  }

  @Put(':id')
    @UseGuards(JwtAuthGuard)
  updateRider(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRiderDto,
  ): Promise<Rider> {
    return this.riderService.updateRider(id, dto);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  deleteRider(@Param('id', ParseIntPipe) id: number): Promise<Rider> {
    return this.riderService.deleteRider(id);
  }

//
// ⭐ Add Review to Rider
@Post(':id/review')
@UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
addReview(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: CreateReviewDto,
): Promise<Review[]> {
  return this.riderService.addReview(id, dto);
}

// 📄 Get Rider Reviews
@Get(':id/reviews')
  @UseGuards(JwtAuthGuard)
getReviews(
  @Param('id', ParseIntPipe) id: number,
): Promise<Review[]> {
  return this.riderService.getReviews(id);
}

@Patch(':id/order-status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
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