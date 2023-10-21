import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Garage } from '../garage/garage.entity';

@Entity({ name: 'service' })
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  minPrice: number;

  @Column({ nullable: false })
  maxPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Garage, (garage) => garage.services)
  garages: Garage[];
}
