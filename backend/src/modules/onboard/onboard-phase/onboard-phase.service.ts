import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOnboardPhaseDto } from './dto/create-onboard-phase.dto';
import { UpdateOnboardPhaseDto } from './dto/update-onboard-phase.dto';
import { AuthRequest } from '../../auth/interface/auth-request.interface';
import { FindRequestDto } from '../../../shared/dto/find-request.dto';
import { OnboardPhase } from './entities/onboard-phase.entity';
import { CoreService } from '../../../shared/modules/routes/core.service';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OnboardPhaseService extends CoreService<OnboardPhase> {
  constructor(
    @InjectRepository(OnboardPhase)
    private readonly onboardPhaseRepository: Repository<OnboardPhase>,
  ) {
    super(onboardPhaseRepository);
  }

  async create(createOnboardPhaseDto: CreateOnboardPhaseDto, req: AuthRequest) {
    const onboardPhase = await this.createCoreService(
      [createOnboardPhaseDto],
      // req.user.userId,
      'system',
    );

    return onboardPhase[0];
  }

  async findAll(req: AuthRequest) {
    // if (req.user.userId) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

    return data;
    // } else {
    //   return [];
    // }
  }

  async findOne(id: number, req: AuthRequest) {
    // if (req.user.userId) {
    return await this.onboardPhaseRepository.findOne({
      where: {
        id,
      },
    });
    // } else {
    //   throw new BadRequestException('User not found');
    // }
  }

  async findOneByName(name: string, req: AuthRequest) {
    // if (req.user.userId) {
    return await this.onboardPhaseRepository.findOneBy({ code: name });
    // } else {
    //   throw new BadRequestException('User not found');
    // }
  }

  async update(
    id: number,
    updateOnboardPhaseDto: UpdateOnboardPhaseDto,
    req: AuthRequest,
  ) {
    const existed = await this.onboardPhaseRepository.findOneBy({
      id,
    });

    if (existed) {
      return await this.updateCoreService(
        { id },
        updateOnboardPhaseDto,
        'system',
      );
    } else {
      throw new BadRequestException('Onboard phase not found');
    }
  }

  async remove(id: number, req: AuthRequest) {
    const removeEntity = await this.onboardPhaseRepository.findOneBy({
      id,
    });

    if (removeEntity) {
      return await this.onboardPhaseRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('Onboard phase not found');
    }
  }
}
