import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AssignRiderDto } from './dto/assign-rider.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // CREATE
  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      skipMissingProperties: false,
    }),
  )
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  // SEARCH (Query)
  @Get('search')
  search(@Query('name') name: string) {
    return this.adminService.search(name ?? '');
  }

  // GET ONE (with pipe)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  // PUT (Full update)
  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  )
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAdminDto) {
    return this.adminService.update(id, dto);
  }

  // PATCH (Partial update)
  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  )
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminDto,
  ) {
    return this.adminService.partialUpdate(id, dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }

  // Assign Rider to Admin
  @Post(':adminId/riders')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  assignRider(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() dto: AssignRiderDto,
  ) {
    return this.adminService.assignRider(adminId, dto.riderId);
  }

  // Fetch Admin with Riders
  @Get(':adminId/riders')
  getRiders(@Param('adminId', ParseIntPipe) adminId: number) {
    return this.adminService.getAdminWithRiders(adminId);
  }

  // Remove Rider from Admin
  @Delete(':adminId/riders/:riderId')
  removeRider(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Param('riderId', ParseIntPipe) riderId: number,
  ) {
    return this.adminService.removeRider(adminId, riderId);
  }

  // Assign Rider to Order
  @Patch('/orders/:orderId/rider')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  assignOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: AssignRiderDto,
  ) {
    return this.adminService.assignRiderToOrder(orderId, dto.riderId);
  }
}
