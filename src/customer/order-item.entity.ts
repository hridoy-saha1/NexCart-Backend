import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { ProductEntity } from 'src/seller/entities/product.entity';
import { SellerEntity } from 'src/seller/entities/seller.entity';

export enum SellerOrderItemStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  SHIPPED = 'shipped',
}

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

  @Column('decimal', {
    default: 0,
  })
  price: number;

  @Column({ default: 1 })
  quantity: number;

  // ✅ NEW: seller-level order control
  @Column({
    type: 'enum',
    enum: SellerOrderItemStatus,
    default: SellerOrderItemStatus.PENDING,
  })
  status: SellerOrderItemStatus;
}