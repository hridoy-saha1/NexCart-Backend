import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './customer.dto';

import { customerEntity } from './customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  createUser(@Body() dto: CreateCustomerDto): Promise<customerEntity> {
    return this.customerService.createUser(dto);
  }
}
