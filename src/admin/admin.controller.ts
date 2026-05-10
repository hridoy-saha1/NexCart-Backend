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
import { LoginAdminDto } from './dto/login-admin.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // LOGIN
  @Post('login')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }), // property role should not exist (400 - Bad Request)
  )
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  // CREATE
  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  )
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Post('verify-otp')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.adminService.verifyOtp(dto);
  }

  @Post('resend-otp')
  resendOtp() {
    return this.adminService.resendOtp(); // no body needed
  }

  // Approve admin
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  approveAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.approveAdmin(id);
  }

  // Deny/remove admin
  @Patch(':id/deny')
  @UseGuards(JwtAuthGuard)
  denyAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.denyAdmin(id);
  }

  // Deactivate admin
  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  deactivateAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deactivateAdmin(id);
  }

  // Activate admin
  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard)
  activateAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.activateAdmin(id);
  }

  // GET ALL
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.adminService.findAll();
  }

  // SEARCH (Query)
  @Get('search')
  @UseGuards(JwtAuthGuard)
  search(@Query('name') name: string) {
    return this.adminService.search(name ?? '');
  }

  // GET ONE (with pipe)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  // PUT (Full update)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      skipMissingProperties: false,
    }),
  )
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAdminDto) {
    return this.adminService.update(id, dto);
  }

  // PATCH (Partial update)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
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
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }

  // Assign Rider to Admin
  @Post(':adminId/riders')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  getRiders(@Param('adminId', ParseIntPipe) adminId: number) {
    return this.adminService.getAdminWithRiders(adminId);
  }

  // Remove Rider from Admin
  @Delete(':adminId/riders/:riderId')
  @UseGuards(JwtAuthGuard)
  removeRider(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Param('riderId', ParseIntPipe) riderId: number,
  ) {
    return this.adminService.removeRider(adminId, riderId);
  }

  // Assign Rider to Order
  @Patch('orders/:orderId/rider')
  @UseGuards(JwtAuthGuard)
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
