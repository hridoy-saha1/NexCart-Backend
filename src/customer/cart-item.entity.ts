import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { customerEntity } from './customer.entity';
import { ProductEntity } from 'src/seller/entities/product.entity';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => customerEntity, (customer) => customer.cartItems)
  customer: customerEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: ProductEntity;

  @Column({ default: 1 })
  quantity: number;
}
