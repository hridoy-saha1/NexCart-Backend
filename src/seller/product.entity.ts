import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => SellerEntity, (seller) => seller.products)
  seller: SellerEntity;
}
