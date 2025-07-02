import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfig } from './entities/app-config.entity';
import { FindRequestDto } from '../../shared/dto/find-request.dto';
import { CoreService } from '../../shared/modules/routes/core.service';
import { AuthRequest } from '../auth/interface/auth-request.interface';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class AppConfigService extends CoreService<AppConfig> {
  constructor(
    @InjectRepository(AppConfig)
    private readonly appConfigRepository: Repository<AppConfig>,
  ) {
    super(appConfigRepository);
  }

  async create(createAppConfigDto: CreateAppConfigDto, req: AuthRequest) {
    const appConfig = await this.createCoreService(
      [createAppConfigDto],
      // req.user.userId,
      'system',
    );

    return appConfig[0];
  }

  async createOrUpdateConfig(
    createAppConfigDto: CreateAppConfigDto,
    req: AuthRequest,
  ) {
    const existed = await this.findOneByName(createAppConfigDto.name);

    if (existed) {
      await this.update(existed.id, createAppConfigDto, req);
      return await this.findOneByName(createAppConfigDto.name);
    } else {
      return await this.create(createAppConfigDto, req);
    }
  }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

    return data;
  }

  async findOne(id: number) {
    return await this.appConfigRepository.findOneBy({ id });
  }

  async findOneByName(name: string) {
    return await this.appConfigRepository.findOneBy({ name });
  }

  async update(
    id: number,
    updateAppConfigDto: UpdateAppConfigDto,
    req: AuthRequest,
  ) {
    const existed = await this.findOne(id);

    if (existed) {
      return await this.updateCoreService(
        { id },
        updateAppConfigDto,
        // req.user.userId,
        'system',
      );
    } else {
      throw new BadRequestException('App config not existed');
    }
  }

  async remove(id: number, req: AuthRequest) {
    const removeEntity = await this.appConfigRepository.findOneBy({ id });

    if (removeEntity) {
      return await this.appConfigRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('App config not existed');
    }
  }
}
