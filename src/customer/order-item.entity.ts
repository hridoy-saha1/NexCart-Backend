import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { ProductEntity } from 'src/seller/product.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  product: ProductEntity;

  @Column({ default: 1 })
  quantity: number;
}