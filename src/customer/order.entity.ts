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
import { Rider } from 'src/rider/rider.entity';
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
    enum: [
      'pending',
      'accepted',
      'partial',
      'rider_assigned',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ],
    default: 'pending',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['cash', 'card', 'bkash', 'nagad'],
  })
  paymentMethod: string;

  // Payment lifecycle — separate from order fulfillment status above
  @Column({
    type: 'enum',
    enum: ['unpaid', 'paid', 'failed', 'cancelled'],
    default: 'unpaid',
  })
  paymentStatus: string;

  // SSLCommerz transaction id, set once a payment session is created
  @Column({ nullable: true })
  tranId: string;

  // Timestamp of successful payment confirmation
  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  // Orders & Rider
  @ManyToOne(() => Rider, (rider) => rider.orders, {
    nullable: true,
  })
  rider: Rider;

  @OneToMany(() => Delivery, (delivery) => delivery.order)
  deliveries: Delivery[];
}
