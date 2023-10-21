import { IsEnum } from 'class-validator';
import { GENDER, USER_ROLE, USER_STATUS } from 'src/enums/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Garage } from '../garage/garage.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: false, default: USER_ROLE.USER })
  @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @Column({ nullable: false })
  @IsEnum(GENDER)
  gender: GENDER;

  @Column({ nullable: false })
  dob: string;

  @Column({ nullable: false, default: USER_STATUS.ACTIVE })
  @IsEnum(USER_STATUS)
  status: USER_STATUS;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Garage, (garage) => garage.user)
  garages: Garage[];
}
