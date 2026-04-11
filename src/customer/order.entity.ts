import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { customerEntity } from './customer.entity';
import { OrderItem } from './order-item.entity';
import { Delivery } from 'src/rider/delivery.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => customerEntity, (customer) => customer.orders)
  customer: customerEntity;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: true })
  orderItems: OrderItem[];

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['cash', 'card', 'bkash', 'nagad'],
  })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

 

@OneToMany(() => Delivery, (delivery) => delivery.order)
deliveries: Delivery[];
}
