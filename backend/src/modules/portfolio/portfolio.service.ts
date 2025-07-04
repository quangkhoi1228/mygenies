import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindRequestDto } from '../../shared/dto/find-request.dto';
import { CoreService } from '../../shared/modules/routes/core.service';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { UserService } from '../user/user/user.service';
import { SlackService } from '../third-party/slack/slack.service';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class PortfolioService extends CoreService<Portfolio> {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    private readonly userService: UserService,
    private readonly slackService: SlackService,
  ) {
    super(portfolioRepository);
  }

  async create(createPortfolioDto: CreatePortfolioDto, req: AuthRequest) {
    const portfolio = await this.createCoreService(
      [createPortfolioDto],
      req.user.userId,
    );

    return portfolio[0];
  }

  // async createOrUpdateConfig(
  //   createStockOrderDto: CreateStockOrderDto,
  //   req: AuthRequest,
  // ) {
  //   const existed = await this.findOneByName(createStockOrderDto);

  //   if (existed) {
  //     await this.update(existed.id, createAppConfigDto, req);
  //     return await this.findOneByName(createAppConfigDto.name);
  //   } else {
  //     return await this.create(createAppConfigDto, req);
  //   }
  // }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

    return data;
  }

  async findOne(id: number) {
    return await this.portfolioRepository.findOneBy({ id });
  }

  async findOneByStockCode(stockCode: string) {
    return await this.portfolioRepository.findOneBy({ stockCode });
  }

  async updateByStockCode(
    updatePortfolioDto: UpdatePortfolioDto,
    req: AuthRequest,
  ) {
    try {
      const existed = await this.findOneByStockCode(
        updatePortfolioDto.stockCode,
      );
      if (existed) {
        await this.updateCoreService(
          { stockCode: updatePortfolioDto.stockCode },
          updatePortfolioDto,
          req.user.userId,
        );
        return await this.findOneByStockCode(updatePortfolioDto.stockCode);
      } else {
        const newPortfolio = await this.createCoreService(
          [updatePortfolioDto],
          req.user.userId,
        );
        return newPortfolio[0];
      }
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
    req: AuthRequest,
  ) {
    const existed = await this.findOne(id);

    if (existed) {
      return await this.updateCoreService(
        { id },
        updatePortfolioDto,
        req.user.userId,
      );
    } else {
      throw new BadRequestException('Portfolio not existed');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.portfolioRepository.findOneBy({ id });

    if (removeEntity) {
      return await this.portfolioRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('Portfolio not existed');
    }
  }

  async processMonthlyCron() {
    const users = await this.userService.getRepository().find({
      ...this.userService.createDefaultFindOption(),
    });

    for (const user of users) {
      const dataDto = this.userService.convertDataToResponse(user);

      const portfolios = await this.portfolioRepository.find({
        where: {
          createdUser: dataDto.id,
        },
        order: {
          stockCode: 'desc',
        },
      });

      await this.slackService.sendPortfolioSignalMessage(portfolios, dataDto);
    }
  }
}
