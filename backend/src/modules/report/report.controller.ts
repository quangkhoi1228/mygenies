import { Body, Controller, Post, Req } from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthRequest } from '../auth/interface/auth-request.interface';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('send-weekly-report')
  sendWeeklyReport(@Req() req: AuthRequest) {
    return this.reportService.processReportPortfolioAndSellProfitCron();
  }

  // @Get()
  // findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
  //   return this.portfolioService.findAll(req);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.portfolioService.findOne(+id);
  // }

  // @Patch(':id')
  // // @UseGuards(AdminAuthGuard)
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePortfolioDto: UpdatePortfolioDto,
  //   @Req() req: AuthRequest,
  // ) {
  //   return this.portfolioService.update(+id, updatePortfolioDto, req);
  // }

  // @Delete(':id')
  // // @UseGuards(AdminAuthGuard)
  // remove(@Param('id') id: string) {
  //   return this.portfolioService.remove(+id);
  // }
}
