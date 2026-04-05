import { CreateCustomerDto } from './customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { customerEntity } from './customer.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(customerEntity)
    private userRepository: Repository<customerEntity>,
  ) {}
  async createUser(dto: CreateCustomerDto): Promise<customerEntity>{
    return await this.userRepository.save(dto);
  }
}
