import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioDto } from './create-portfolio.dto';

export class UpdatePortfolioDto extends PartialType(CreatePortfolioDto) {
  t0Volume?: number;
  t1Volume?: number;
  t2Volume?: number;
  t3Volume?: number;
}
