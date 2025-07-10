import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PaginationDto } from 'src/shared/dto/find-request.dto';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateStockOrderTransactionDto } from './dto/create-stock-order-transaction.dto';
import { StockOrderTransactionService } from './stock-order-transaction.service';
import { UpdateStockOrderTransactionDto } from './dto/update-stock-order-transaction.dto';

@Controller('stock-order-transaction')
export class StockOrderTransactionController {
  constructor(
    private readonly stockOrderTransactionService: StockOrderTransactionService,
  ) {}

  @Post()
  // @UseGuards(AdminAuthGuard)
  create(
    @Body() createStockOrderTransactionDto: CreateStockOrderTransactionDto,
    @Req() req: AuthRequest,
  ) {
    return this.stockOrderTransactionService.create(
      createStockOrderTransactionDto,
      req,
    );
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.stockOrderTransactionService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockOrderTransactionService.findOne(+id);
  }

  @Patch(':id')
  // @UseGuards(AdminAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateStockOrderTransactionDto: UpdateStockOrderTransactionDto,
    @Req() req: AuthRequest,
  ) {
    return this.stockOrderTransactionService.update(
      +id,
      updateStockOrderTransactionDto,
      req,
    );
  }

  @Delete(':id')
  // @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.stockOrderTransactionService.remove(+id);
  }
}
