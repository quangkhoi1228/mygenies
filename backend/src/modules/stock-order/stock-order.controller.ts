import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dto/find-request.dto';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateStockOrderDto } from './dto/create-stock-order.dto';
import { StockOrderService } from './stock-order.service';

@Controller('stockOrder')
export class StockOrderController {
  constructor(private readonly stockOrderService: StockOrderService) {}

  @Post()
  // @UseGuards(AdminAuthGuard)
  create(
    @Body() createStockOrderDto: CreateStockOrderDto,
    @Req() req: AuthRequest,
  ) {
    return this.stockOrderService.create(createStockOrderDto, req);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.stockOrderService.findAll(req);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.stockOrderService.findOne(+id);
  // }

  // @Patch(':id')
  // // @UseGuards(AdminAuthGuard)
  // update(
  //   @Param('id') id: string,
  //   @Body() updateStockOrderDto: UpdateStockOrderDto,
  //   @Req() req: AuthRequest,
  // ) {
  //   return this.stockOrderService.update(+id, updateStockOrderDto, req);
  // }

  // @Delete(':id')
  // // @UseGuards(AdminAuthGuard)
  // remove(@Param('id') id: string) {
  //   return this.stockOrderService.remove(+id);
  // }
}
