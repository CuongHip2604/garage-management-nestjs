import { IsEnum } from 'class-validator';
import { GARAGE_STATUS } from 'src/enums/garage';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../service/service.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'garage' })
export class Garage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  address: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column()
  description: string;

  @Column({ nullable: false, default: GARAGE_STATUS.ACTIVE })
  @IsEnum(GARAGE_STATUS)
  status: GARAGE_STATUS;

  @Column({ nullable: false })
  openTime: string;

  @Column({ nullable: false })
  closeTime: string;

  @Column()
  policy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.garages)
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToMany(() => Service, (service) => service.garages)
  @JoinTable()
  services: Service[];
}
