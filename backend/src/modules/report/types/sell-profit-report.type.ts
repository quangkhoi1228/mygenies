export type SellProfitReportTransactionType = {
  stockCode: string;
  avgPrice: number;
  sellPrice: number;
  volume: number;
  status: string;
  profit: number;
  profitPercent: number;
};

export type SellProfitReportType = {
  totalProfit: number;
  totalProfitPercent: number;
  transactions: SellProfitReportTransactionType[];
};
