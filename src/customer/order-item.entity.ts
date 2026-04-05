import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { ProductEntity } from 'src/seller/product.entity';
import { SellerEntity } from 'src/seller/seller.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  product: ProductEntity;

  @ManyToOne(() => SellerEntity)
  seller: SellerEntity;

  @Column({ default: 1 })
  quantity: number;
}
