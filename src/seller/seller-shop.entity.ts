import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SellerEntity } from './seller.entity';

@Entity('seller_shop')
export class SellerShopEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  shopName: string;

  @Column({ type: 'varchar', length: 255 })
  shopAddress: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  tradeLicense: string;

  @OneToOne(() => SellerEntity, (seller) => seller.shop)
  @JoinColumn()
  seller: SellerEntity;
}
