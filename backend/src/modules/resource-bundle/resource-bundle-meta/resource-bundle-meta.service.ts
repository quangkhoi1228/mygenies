import { Injectable } from '@nestjs/common';
import { CreateResourceBundleMetaDto } from './dto/create-resource-bundle-meta.dto';
import { UpdateResourceBundleMetaDto } from './dto/update-resource-bundle-meta.dto';
import { ResourceBundleMeta } from './entities/resource-bundle-meta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { FindManyOptions, Repository } from 'typeorm';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Injectable()
export class ResourceBundleMetaService extends CoreService<ResourceBundleMeta> {
  constructor(
    @InjectRepository(ResourceBundleMeta)
    private readonly resourceBundleMetaRepository: Repository<ResourceBundleMeta>,
  ) {
    super(resourceBundleMetaRepository);
  }

  async create(
    createResourceBundleMetaDto: CreateResourceBundleMetaDto,
    req: AuthRequest,
  ) {
    return await this.createCoreService(
      [createResourceBundleMetaDto],
      req.user.userId,
    );
  }

  async createMultiple(
    createResourceBundleMetaDtos: CreateResourceBundleMetaDto[],
    req: AuthRequest,
  ) {
    return await this.createCoreService(
      createResourceBundleMetaDtos,
      // req.user.userId,
      'system',
    );
  }

  findAll() {
    return `This action returns all resourceBundleMeta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resourceBundleMeta`;
  }

  async update(
    id: number,
    updateResourceBundleMetaDto: UpdateResourceBundleMetaDto,
    req: AuthRequest,
  ) {
    return await this.updateCoreService(
      { id },
      updateResourceBundleMetaDto,
      req.user.userId,
    );
  }

  async remove(id: number) {
    const removeEntity =
      await this.resourceBundleMetaRepository.findOneByOrFail({
        id,
      });
    return await this.resourceBundleMetaRepository.remove(removeEntity);
  }

  createDefaultFindOption(
    findAll: boolean = false,
  ): FindManyOptions<ResourceBundleMeta> {
    return {
      relations: {
        resourceBundleKey: findAll,
      },
      select: {},
    };
  }
}
