import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { customerEntity } from './customer.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => customerEntity, (customer) => customer.orders)
  customer: customerEntity;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: true })
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}