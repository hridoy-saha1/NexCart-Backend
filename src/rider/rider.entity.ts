import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany, ManyToMany } from 'typeorm';
import { Review } from './review.entity';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { Order } from 'src/customer/order.entity';

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

  @Column({
    type: 'enum',
    enum: ['available', 'busy', 'offline'],
    default: 'offline',
  })
  status: 'available' | 'busy' | 'offline';

  @Column({ nullable: true })
  vehicle_type: string;

  @Column({ nullable: true })
  current_location: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Review, (review) => review.rider)
  reviews: Review[];

  // Rider & Admin
  @ManyToMany(() => AdminEntity, (admin) => admin.riders)
  admins: AdminEntity[];

  // Rider & Orders
  @OneToMany(() => Order, (order) => order.rider)
  orders: Order[];
}
