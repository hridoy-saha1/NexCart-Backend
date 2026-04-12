import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Rider } from 'src/rider/rider.entity';

@Entity('admin')
export class AdminEntity {
  // PRIMARY KEY
  @PrimaryGeneratedColumn()
  id: number;

  // NAME
  @Column({ type: 'varchar', length: 100 })
  name: string;

  // EMAIL (UNIQUE)
  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  // PASSWORD
  @Column({ type: 'varchar', length: 255 })
  password: string;

  // ACTIVE STATUS
  @Column({ default: false })
  isActive: boolean;

  // OTP fields
  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiry: Date | null;

  @Column({ default: false })
  isVerified: boolean;

  // CREATED TIME
  @CreateDateColumn()
  createdAt: Date;

  // UPDATED TIME
  @UpdateDateColumn()
  updatedAt: Date;

  // Admin & Rider
  @ManyToMany(() => Rider, (rider) => rider.admins)
  @JoinTable()
  riders: Rider[];
}
