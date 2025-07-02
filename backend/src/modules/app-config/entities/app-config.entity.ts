import { CoreEntityHasPrimaryId } from '../../../shared/modules/routes/entity/core.entity';
import { Entity, Unique, Column } from 'typeorm';
import { ConfigType } from '../dto/create-app-config.dto';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['name'])
export class AppConfig extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  value: string;

  @ApiProperty()
  @Column()
  type: ConfigType;
}
