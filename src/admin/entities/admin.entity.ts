import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin')
export class AdminEntity {
  // PRIMARY KEY
  @PrimaryGeneratedColumn()
  id!: number;

  // NAME
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  // EMAIL (UNIQUE)
  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  // PASSWORD
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  // ACTIVE STATUS (default true)
  @Column({ default: false })
  isActive!: boolean;

  // CREATED TIME
  @CreateDateColumn()
  createdAt!: Date;

  // UPDATED TIME
  @UpdateDateColumn()
  updatedAt!: Date;
}
