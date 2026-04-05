import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Order } from './order.entity';
@Entity('customer')
export class customerEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profilePic: string;

  @OneToMany(() => CartItem, (cart) => cart.customer)
  cartItems: CartItem[];
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
