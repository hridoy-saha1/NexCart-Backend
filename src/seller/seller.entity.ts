// import { Entity, Column, BeforeInsert, PrimaryColumn } from 'typeorm';

// @Entity('seller')
// export class SellerEntity {

//   @PrimaryColumn()
//   id: string;

//   @BeforeInsert()
//   generateId(): void {
//     this.id = `SEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//   }

//   @Column({ type: 'boolean', default: true })
//   isActive: boolean;

//   @Column({ type: 'varchar', nullable: true })
//   fullName: string | null;

//   @Column({ type: 'bigint', unsigned: true })
//   phone: string;
// }

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seller')
export class SellerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string | null;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nidNumber: string;

  @Column({ type: 'varchar', length: 255 })
  nidImage: string;
}
