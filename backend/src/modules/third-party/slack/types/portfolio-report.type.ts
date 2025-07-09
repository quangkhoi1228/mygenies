import { Portfolio } from 'src/modules/portfolio/entities/portfolio.entity';

export type PortfolioReportType = Portfolio & {
  percent: string;
  status: string;
};
