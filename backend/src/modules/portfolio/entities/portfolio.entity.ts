import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Portfolio {
  @Generated('increment')
  @Column()
  id: number;

  @ApiProperty()
  @PrimaryColumn()
  stockCode: string;

  @ApiProperty()
  @Column()
  volume: number;

  @ApiProperty()
  @Column()
  price: number;

  @CreateDateColumn()
  @Column({ nullable: false })
  @ApiProperty()
  createdAt?: Date;

  @PrimaryColumn({ nullable: false })
  @ApiProperty()
  createdUser: number;

  @Column({ nullable: false })
  @ApiProperty()
  updatedAt?: Date;

  @UpdateDateColumn()
  @Column({ nullable: false })
  @ApiProperty()
  updatedUser: number;
}
