import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dto/find-request.dto';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // @Post()
  // // @UseGuards(AdminAuthGuard)
  // create(
  //   @Body() createPortfolioDto: CreatePortfolioDto,
  //   @Req() req: AuthRequest,
  // ) {
  //   return this.portfolioService.create(createPortfolioDto, req);
  // }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.portfolioService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portfolioService.findOne(+id);
  }

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
