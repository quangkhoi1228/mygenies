import { Injectable } from '@nestjs/common';
import { CreateResourceBundleKeyDto } from './dto/create-resource-bundle-key.dto';
import { UpdateResourceBundleKeyDto } from './dto/update-resource-bundle-key.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { FindManyOptions, Repository } from 'typeorm';
import { ResourceBundleKey } from './entities/resource-bundle-key.entity';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { FindRequestDto } from 'src/shared/dto/find-request.dto';

@Injectable()
export class ResourceBundleKeyService extends CoreService<ResourceBundleKey> {
  constructor(
    @InjectRepository(ResourceBundleKey)
    private readonly resourceBundleKeyRepository: Repository<ResourceBundleKey>,
  ) {
    super(resourceBundleKeyRepository);
  }

  async create(
    createResourceBundleKeyDto: CreateResourceBundleKeyDto,
    req: AuthRequest,
  ) {
    return await this.createCoreService(
      [createResourceBundleKeyDto],
      // req.user.userId,
      'system',
    );
  }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(
      findRequestDto,
      this.createDefaultFindOption(),
    );

    return data;
  }

  async findOne(id: number, req: AuthRequest) {
    return await this.resourceBundleKeyRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateResourceBundleKeyDto: UpdateResourceBundleKeyDto) {
    return `This action updates a #${id} resourceBundleKey`;
  }

  async remove(id: number) {
    const removeEntity = await this.resourceBundleKeyRepository.findOneByOrFail(
      {
        id,
      },
    );

    return await this.resourceBundleKeyRepository.remove(removeEntity);
  }

  createDefaultFindOption(): FindManyOptions<ResourceBundleKey> {
    return {
      relations: {
        resourceBundleMeta: true,
      },
      select: {
        resourceBundleMeta: {
          id: true,
          langCode: true,
          value: true,
        },
      },
    };
  }
}
