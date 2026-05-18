
// // delivery.entity.ts

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   CreateDateColumn,
// } from 'typeorm';
// import { Rider } from './rider.entity';
// import { Order } from 'src/customer/order.entity';

// @Entity('deliveries')
// export class Delivery {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Order)
//   order: Order;

//   @ManyToOne(() => Rider)
//   rider: Rider;

//   @CreateDateColumn()
//   deliveredAt: Date;
// }



import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';

import { Rider } from './rider.entity';
import { Order } from 'src/customer/order.entity';

export enum DeliveryStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Rider)
  rider: Rider;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @CreateDateColumn()
  deliveredAt: Date;
}