import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CreateUserAiConfigOptionDto,
  CreateUserAiConfigOptionRawDto,
} from './dto/create-user-ai-config-option.dto';
import { UpdateUserAiConfigOptionDto } from './dto/update-user-ai-config-option.dto';
import { UserAiConfigOption } from './entities/user-ai-config-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { Repository } from 'typeorm';
import { FindRequestDto } from 'src/shared/dto/find-request.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { UserAiConfigService } from '../user-ai-config/user-ai-config.service';

@Injectable()
export class UserAiConfigOptionService extends CoreService<UserAiConfigOption> {
  constructor(
    @InjectRepository(UserAiConfigOption)
    private readonly userAiConfigOptionRepository: Repository<UserAiConfigOption>,

    @Inject(forwardRef(() => UserAiConfigService))
    private readonly userAiConfigService: UserAiConfigService,
  ) {
    super(userAiConfigOptionRepository);
  }

  async createMultiple(
    createUserAiConfigOptionDtos: CreateUserAiConfigOptionDto[],
  ) {
    return await this.createCoreService(createUserAiConfigOptionDtos, 'system');
  }

  async create(createUserAiConfigOptionDto: CreateUserAiConfigOptionDto) {
    return await this.createCoreService(
      [createUserAiConfigOptionDto],
      'system',
    );
  }

  async createRaw(
    createUserAiConfigOptionRawDto: CreateUserAiConfigOptionRawDto,
  ) {
    const userAiConfig = await this.userAiConfigService.findOne(
      createUserAiConfigOptionRawDto.configId,
    );

    //
    delete userAiConfig.options;

    if (userAiConfig) {
      const createUserAiConfigOptionDto = new CreateUserAiConfigOptionDto();
      createUserAiConfigOptionDto.name = createUserAiConfigOptionRawDto.name;
      createUserAiConfigOptionDto.value = createUserAiConfigOptionRawDto.value;
      createUserAiConfigOptionDto.url = createUserAiConfigOptionRawDto.url;
      createUserAiConfigOptionDto.config = userAiConfig;

      return await this.create(createUserAiConfigOptionDto);
    } else {
      throw new BadRequestException('User AI config not found');
    }
  }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

    return data;
  }

  async findOne(id: number) {
    const userAiConfig = await this.userAiConfigOptionRepository.findOne({
      where: {
        id: id,
      },
    });

    return userAiConfig;
  }

  async update(
    id: number,
    updateUserAiConfigOptionDto: UpdateUserAiConfigOptionDto,
  ) {
    const existed = await this.userAiConfigOptionRepository.findOne({
      where: {
        id: id,
      },
    });

    if (existed) {
      return await this.updateCoreService(
        { id },
        updateUserAiConfigOptionDto,
        'system',
      );
    } else {
      throw new BadRequestException('User AI config option not found');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.userAiConfigOptionRepository.findOneBy({
      id,
    });

    if (removeEntity) {
      return await this.userAiConfigOptionRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('User AI config option not found');
    }
  }
}
