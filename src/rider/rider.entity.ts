import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';

import { Review } from './review.entity';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { Order } from 'src/customer/order.entity';

// =========================
// ENUMS
// =========================
export enum RiderStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
}

export enum VehicleType {
  BIKE = 'bike',
  CAR = 'car',
  SCOOTER = 'scooter',
  BICYCLE = 'bicycle',
  TRUCK = 'truck',
}

// =========================
// ENTITY
// =========================
@Entity()
export class Rider {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  // =========================
  // STATUS
  // =========================
  @Column({
    type: 'enum',
    enum: RiderStatus,
    default: RiderStatus.OFFLINE,
  })
  status: RiderStatus;

  // =========================
  // VEHICLE TYPE
  // =========================
  @Column({
    type: 'enum',
    enum: VehicleType,
    nullable: true,
  })
  vehicle_type?: VehicleType;

  // =========================
  // LOCATION
  // =========================
  @Column({ nullable: true })
  current_location?: string;

  // =========================
  // PROFILE IMAGE (FIXED)
  // =========================
  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  profileImage?: string | null;

  // =========================
  // RELATIONS
  // =========================

  @OneToMany(() => Review, (review) => review.rider)
  reviews: Review[];

  @ManyToMany(() => AdminEntity, (admin) => admin.riders)
  admins: AdminEntity[];

  @OneToMany(() => Order, (order) => order.rider)
  orders: Order[];
}