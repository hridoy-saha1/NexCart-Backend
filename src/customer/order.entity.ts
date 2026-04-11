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
<<<<<<< HEAD
import { Rider } from 'src/rider/rider.entity';
=======
import { Delivery } from 'src/rider/delivery.entity';
>>>>>>> 28be154f3d85a1ff1ea1256ab08417478f503321

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

<<<<<<< HEAD
  // Orders & Rider
  @ManyToOne(() => Rider, (rider) => rider.orders, {
    nullable: true,
  })
  rider: Rider;
=======
 

@OneToMany(() => Delivery, (delivery) => delivery.order)
deliveries: Delivery[];
>>>>>>> 28be154f3d85a1ff1ea1256ab08417478f503321
}
