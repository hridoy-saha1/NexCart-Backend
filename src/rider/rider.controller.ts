import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';

import { RiderService } from './rider.service';

//Import DTOs
import {
  CreateRiderDto,
  UpdateStatusDto,
  UpdateLocationDto,
  UpdateAvailabilityDto,
  CancelDeliveryDto,
} from './rider.dto';

@Controller('rider')
export class RiderController {
constructor(private readonly riderService: RiderService) {}

  //Assigned Orders
  @Get('orders')
  getAssignedOrders(@Query('status') status: string) {
    return this.riderService.getAssignedOrders(status);
  }

  //Single Order
  @Get('orders/:id')
  getSingleOrder(@Param('id') id: string) {
    return this.riderService.getSingleOrder(id);
  }

  //Accept Delivery
  @Post('accept')
  acceptDelivery(@Body() dto: CreateRiderDto) {
    return this.riderService.acceptRider(dto);
  }

  //Update Order Status
  @Put('orders/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.riderService.updateStatus(id, dto);
  }

  //Update Location
  @Patch('location')
  updateLocation(@Body() dto: UpdateLocationDto) {
    return this.riderService.updateLocation(dto);
  }

  //Toggle Availability
  @Patch('availability')
  toggleAvailability(@Body() dto: UpdateAvailabilityDto) {
    return this.riderService.toggleAvailability(dto);
  }

  //Cancel Delivery
  @Delete('orders/:id')
  cancelDelivery(
    @Param('id') id: string,
    @Body() dto: CancelDeliveryDto,
  ) {
    return this.riderService.cancelDelivery(id, dto);
  }

  //View Earnings
  @Get('earnings')
  getEarnings(@Query('month') month: string) {
    return this.riderService.getEarnings(month);
  }
}
