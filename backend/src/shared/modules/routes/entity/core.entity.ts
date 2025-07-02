import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Injectable()
export class CoreEntityRoot {
  // constructor() {
  //   this.createdAt = new Date();
  //   this.updatedAt = new Date();
  // }

  @CreateDateColumn()
  @Column({ nullable: false })
  @ApiProperty()
  createdAt?: Date;

  @Column({ nullable: false })
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

@Injectable()
export class CoreEntity extends CoreEntityRoot {
  @Generated('increment')
  @Column()
  id: number;
}

@Injectable()
export class CoreEntityHasPrimaryId extends CoreEntityRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
}
@Injectable()
export class CoreEntityHasPrimaryIdWithNote extends CoreEntityHasPrimaryId {
  @Column({ nullable: true })
  note: string;
}
