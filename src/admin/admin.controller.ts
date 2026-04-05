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

  // 7. DELETE
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}
