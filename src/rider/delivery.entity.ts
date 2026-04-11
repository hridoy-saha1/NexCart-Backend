
// delivery.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Rider } from './rider.entity';
import { Order } from 'src/customer/order.entity';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Rider)
  rider: Rider;

  @CreateDateColumn()
  deliveredAt: Date;
}