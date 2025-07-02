import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateResourceBundleDto,
  ToActionMeta,
} from './dto/create-resource-bundle.dto';
import { UpdateResourceBundleDto } from './dto/update-resource-bundle.dto';
import { CreateResourceBundleKeyDto } from '../resource-bundle-key/dto/create-resource-bundle-key.dto';
import { ResourceBundleKeyService } from '../resource-bundle-key/resource-bundle-key.service';
import { ResourceBundleMetaService } from '../resource-bundle-meta/resource-bundle-meta.service';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { CreateResourceBundleMetaDto } from '../resource-bundle-meta/dto/create-resource-bundle-meta.dto';
import { LangCodesEnum } from './entities/resource-bundle.entity';
import { UpdateResourceBundleMetaDto } from '../resource-bundle-meta/dto/update-resource-bundle-meta.dto';
import { ResourceBundleKey } from '../resource-bundle-key/entities/resource-bundle-key.entity';
import { formatDateToYYYYMMDDHHMM } from 'src/utils/date.util';

@Injectable()
export class ResourceBundleService {
  constructor(
    private readonly resourceBundleKeyService: ResourceBundleKeyService,
    private readonly resourceBundleMetaService: ResourceBundleMetaService,
  ) {}

  async create(
    createResourceBundleDto: CreateResourceBundleDto,
    req: AuthRequest,
  ) {
    try {
      // create Key
      const createKeyDto = new CreateResourceBundleKeyDto();
      createKeyDto.key = createResourceBundleDto.key;

      const createKeyResult = await this.resourceBundleKeyService.create(
        createKeyDto,
        req,
      );

      // create Meta
      return await this.createMeta(
        createKeyResult[0],
        createResourceBundleDto.toAddMeta,
        req,
      );
    } catch (error) {
      console.error(`${formatDateToYYYYMMDDHHMM(new Date())} \n`, error);
      throw new BadRequestException(error.detail);
    }
  }

  async createMeta(
    resourceBundleKey: ResourceBundleKey,
    toAddMeta: ToActionMeta[],
    req: AuthRequest,
  ) {
    // create Meta
    const createListMeta = await Promise.all(
      toAddMeta.map((item) => {
        const createMetaDto = new CreateResourceBundleMetaDto();
        createMetaDto.langCode = item.langCode;
        createMetaDto.value = item.value;
        createMetaDto.resourceBundleKey = resourceBundleKey;

        return createMetaDto;
      }),
    );

    try {
      const createMetaResult =
        await this.resourceBundleMetaService.createMultiple(
          createListMeta,
          req,
        );
    } catch (error) {
      console.error(`${formatDateToYYYYMMDDHHMM(new Date())} \n`, error);
    } finally {
      return await this.resourceBundleKeyService.findOne(
        resourceBundleKey.id,
        req,
      );
    }
  }

  async findAll(req: AuthRequest) {
    return await this.resourceBundleKeyService.findAll(req);
  }

  async findOne(id: number, req: AuthRequest) {
    return await this.resourceBundleKeyService.findOne(id, req);
  }

  async update(
    id: number,
    updateResourceBundleDto: UpdateResourceBundleDto,
    req: AuthRequest,
  ) {
    const result = [];

    // cannot edit key name
    const resourceBundleKey = await this.resourceBundleKeyService.findOne(
      id,
      req,
    );

    console.log(resourceBundleKey);

    if (resourceBundleKey) {
      const allExistedLangCode = resourceBundleKey.resourceBundleMeta.map(
        (item) => item.langCode,
      );
      // add meta
      if (
        updateResourceBundleDto.toAddMeta &&
        updateResourceBundleDto.toAddMeta.length > 0
      ) {
        await this.createMeta(
          resourceBundleKey,
          updateResourceBundleDto.toAddMeta.filter(
            (item) => !allExistedLangCode.includes(item.langCode),
          ),
          req,
        );
      }

      // edit meta
      if (
        updateResourceBundleDto.toUpdateMeta &&
        updateResourceBundleDto.toUpdateMeta.length > 0
      ) {
        const updateByLangCode = updateResourceBundleDto.toUpdateMeta
          .filter((item) => allExistedLangCode.includes(item.langCode))
          .reduce((a, v) => ({ ...a, [v.langCode]: v.value }), {});

        const allExistedMeta = resourceBundleKey.resourceBundleMeta.map(
          (item) => {
            return { ...item, toUpdate: updateByLangCode[item.langCode] };
          },
        );

        for (let i = 0; i < allExistedMeta.length; i++) {
          const updateDto = new UpdateResourceBundleMetaDto();
          updateDto.value = allExistedMeta[i].toUpdate;

          try {
            const updateResult = await this.resourceBundleMetaService.update(
              allExistedMeta[i].id,
              updateDto,
              req,
            );

            result.push(updateResult);
          } catch (error) {
            result.push(error.detail);
          }
        }
      }
      return await this.findOne(resourceBundleKey.id, req);
    } else {
      throw new BadRequestException('Resource bundle not found!');
    }
  }

  async remove(id: number, req: AuthRequest) {
    const existed = await this.resourceBundleKeyService.findOne(id, req);

    if (existed) {
      return await this.resourceBundleKeyService.remove(id);
    } else {
      throw new BadRequestException('Resource bundle not found!');
    }
  }

  async findAllByLangCode(
    langCode: LangCodesEnum,
    keyValueOnly: boolean = false,
  ) {
    const allResourceBundle = await this.resourceBundleMetaService
      .getRepository()
      .find({
        relations: {
          resourceBundleKey: false,
        },
        select: {
          id: true,
          langCode: true,
          value: true,
          resourceBundleKeyKey: true,
        },
        where: {
          langCode: langCode,
        },
        order: {
          resourceBundleKeyKey: 'ASC',
        },
      });

    return allResourceBundle.reduce(
      (a, v) => ({
        ...a,
        [v.resourceBundleKeyKey]: keyValueOnly ? v.value : v,
      }),
      {},
    );
  }

  async getObjectResourceBundle() {
    const data = {};
    for (const langCode of Object.keys(LangCodesEnum)) {
      data[langCode] = await this.findAllByLangCode(
        langCode as LangCodesEnum,
        true,
      );
    }

    return data;
  }
}
