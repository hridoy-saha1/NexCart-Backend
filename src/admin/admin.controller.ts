import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorStatusDto } from './dto/update-vendor-status.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CommissionDto } from './dto/commission.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //create vendor
  @Post('vendors')
  createVendor(@Body() dto: CreateVendorDto) {
    return this.adminService.createVendor(dto);
  }

  //approve & reject vendor
  @Patch('vendors/:id/status')
  updateVendorStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVendorStatusDto,
  ) {
    return this.adminService.updateVendorStatus(id, dto);
  }

  //show vendors
  @Get('vendors')
  getVendors(@Query('page') page: number, @Query('status') status: string) {
    return this.adminService.getVendors(page, status);
  }

  //suspend user
  @Patch('users/:id/suspend')
  suspendUser(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.suspendUser(id, reason);
  }

  //create category
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto);
  }

  //show categories
  @Get('categories')
  getCategories() {
    return this.adminService.getCategories();
  }

  //platform analytics
  @Get('analytics')
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  //commission rate
  @Patch('settings/commission')
  setCommission(@Body() dto: CommissionDto) {
    return this.adminService.setCommission(dto);
  }

  //show orders
  @Get('orders')
  getOrders(@Query('page') page: number, @Query('status') status: string) {
    return this.adminService.getOrders(page, status);
  }

  //delete vendor
  @Delete('vendors/:id')
  deleteVendor(@Param('id') id: string) {
    return this.adminService.deleteVendor(id);
  }
}
