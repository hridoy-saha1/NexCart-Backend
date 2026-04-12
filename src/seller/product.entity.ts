import { CartItem } from 'src/customer/cart-item.entity';
import { OrderItem } from 'src/customer/order-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { SellerEntity } from './seller.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  productName: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @OneToMany(() => CartItem, (cart) => cart.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (oi) => oi.product)
  orderItems: OrderItem[];

  @ManyToOne(() => SellerEntity, (seller) => seller.products,{
    cascade: true,
    onDelete: 'CASCADE'
  })
  seller: SellerEntity;
}
