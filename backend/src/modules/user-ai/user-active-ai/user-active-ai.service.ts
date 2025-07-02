import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserActiveAiDto } from './dto/create-user-active-ai.dto';
import { UpdateUserActiveAiDto } from './dto/update-user-active-ai.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/user/user.service';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { Repository } from 'typeorm';
import { UserAiService } from '../user-ai/user-ai.service';
import { UserActiveAi } from './entities/user-active-ai.entity';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Injectable()
export class UserActiveAiService extends CoreService<UserActiveAi> {
  constructor(
    @InjectRepository(UserActiveAi)
    private readonly userActiveAiRepository: Repository<UserActiveAi>,

    private readonly userService: UserService,

    @Inject(forwardRef(() => UserAiService))
    private readonly userAiService: UserAiService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(userActiveAiRepository);
  }

  async create(createUserActiveAiDto: CreateUserActiveAiDto, req: AuthRequest) {
    return await this.createOrUpdate(createUserActiveAiDto, req);
  }

  async createOrUpdate(
    createUserActiveAiDto: CreateUserActiveAiDto,
    req: AuthRequest,
  ) {
    const userId = this.preCheckAuth(req);

    const userAi = await this.userAiService.findOne(
      createUserActiveAiDto.userAiId,
      req,
    );

    if (userAi) {
      const existActive = await this.userActiveAiRepository.findOneBy({
        userId: userId,
      });

      if (existActive) {
        const updateDto = new UpdateUserActiveAiDto();
        updateDto.userAiId = userAi.id;

        return await this.systemUpdate(existActive, updateDto, userId);
      } else {
        const createDto = new CreateUserActiveAiDto();
        createDto.userAiId = userAi.id;
        createDto.userId = userId;

        const created = await this.createCoreService([createDto], userId);

        return created[0];
      }
    } else {
      throw new BadRequestException('User Ai not found');
    }
  }

  async findAll() {
    return `This action returns all userActiveAi`;
  }

  async findOne(id: number) {
    return this.userActiveAiRepository.findOneBy({ id });
  }

  async findActiveByUser(req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    const activeUserAi = await this.userActiveAiRepository.findOneBy({
      userId,
    });

    if (activeUserAi) {
      const userAi = await this.userAiService.findOne(
        activeUserAi.userAiId,
        req,
      );

      if (userAi) {
        return userAi;
      }
    }

    const defaultAi = await this.userAiService.findSystemOne();
    if (defaultAi) {
      return defaultAi;
    } else {
      throw new BadRequestException('No user AI found');
    }
  }

  async systemUpdate(
    userActiveAi: UserActiveAi,
    updateUserActiveAiDto: UpdateUserActiveAiDto,
    userId: number,
  ) {
    await this.updateCoreService(
      {
        id: userActiveAi.id,
      },
      updateUserActiveAiDto,
      userId,
    );

    return await this.findOne(userActiveAi.id);
  }

  async update(
    id: number,
    updateUserActiveAiDto: UpdateUserActiveAiDto,
    req: AuthRequest,
  ) {
    const userId = this.preCheckAuth(req);
    const existed = await this.userActiveAiRepository.findOneBy({
      id,
      userId,
    });

    if (existed) {
      const userAi = await this.userAiService.findOne(
        updateUserActiveAiDto.userAiId,
        req,
      );

      if (userAi) {
        return await this.systemUpdate(existed, updateUserActiveAiDto, userId);
      } else {
        throw new BadRequestException('User AI not found');
      }
    } else {
      throw new BadRequestException('User active AI not found');
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} userActiveAi`;
  }
}
