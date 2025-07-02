import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { FindRequestDto } from '../../dto/find-request.dto';
import { FindResponseDto } from '../../dto/find-response.dto';
import { ReturnMessageDto } from '../../../shared/dto/return-message.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Injectable()
export class CoreService<Entity> {
  constructor(private readonly repository: Repository<Entity>) {}

  async findAllCoreService(req: Request) {
    const findRequestDto = new FindRequestDto(req);

    return await this.findAllCoreServiceByFindRequestDto(findRequestDto);
  }

  getRepository() {
    return this.repository;
  }

  createDefaultQueryString(query: string, findRequestDto: FindRequestDto) {
    let finalQuery = query;

    // add where
    const { whereStatement, originWhereStatement } =
      findRequestDto.getFilterStatement();

    finalQuery =
      query.includes('where') || query.includes('WHERE')
        ? `${finalQuery} ${
            originWhereStatement.trim() !== ''
              ? ` and ${originWhereStatement} `
              : ''
          }`
        : `${finalQuery} ${
            originWhereStatement.trim() !== ''
              ? whereStatement
              : originWhereStatement
          }`;

    // add group by
    if (findRequestDto.groupBy) {
      finalQuery = `
      ${finalQuery}
      group by 
      ${findRequestDto.groupBy}`;
    }

    // add order
    const { sortStatement, originSortStatement } =
      findRequestDto.getSortStatement();
    // console.log('sortStatement', sortStatement, originSortStatement);
    finalQuery = query.toLowerCase().includes('order by')
      ? `${finalQuery} ${
          originSortStatement.trim() !== ''
            ? ` order by ${originSortStatement} `
            : ''
        }`
      : `${finalQuery} ${sortStatement}`;

    return finalQuery;
  }

  async findAllRawWithQueryCoreServiceByFindRequestDto<T>(
    query: string,
    findRequestDto: FindRequestDto,
  ): Promise<FindResponseDto<T>> {
    const finalQuery = this.createDefaultQueryString(query, findRequestDto);

    // console.log(finalQuery);

    const data = await this.repository.query(finalQuery);

    return new FindResponseDto({}, data);
  }

  async findAllWithQueryCoreService<T>(
    query: string,
    req: Request,
  ): Promise<FindResponseDto<T>> {
    const findRequestDto = new FindRequestDto(req);

    return await this.findAllWithQueryCoreServiceByFindRequestDto(
      query,
      findRequestDto,
    );
  }

  async findAllWithQueryCoreServiceByFindRequestDto<T>(
    query: string,
    findRequestDto: FindRequestDto,
  ): Promise<FindResponseDto<T>> {
    const findParam = findRequestDto.getFindParam();

    let finalQuery = this.createDefaultQueryString(query, findRequestDto);

    const countQuery = `
      SELECT COUNT(*) AS totalrecord
      FROM (${finalQuery}) AS subquery
    `;

    // pagination
    finalQuery = `
    ${finalQuery}
    limit ${findParam.take}
    offset ${findParam.skip}`;

    // console.log(finalQuery);
    const data = await this.repository.query(finalQuery);

    const [{ totalrecord }] = await this.repository.query(countQuery);

    const totalRecord: number = Number(totalrecord);
    const totalPage = Math.floor(
      totalRecord % findRequestDto.count > 0
        ? totalRecord / findRequestDto.count + 1
        : totalRecord / findRequestDto.count,
    );

    const meta = {
      page: +findRequestDto.page,
      count: +findRequestDto.count,
      filter: findRequestDto.filter,
      sort: findRequestDto.sort,
      totalRecord,
      totalPage,
    };
    return new FindResponseDto(meta, data);
  }

  async findAllCoreServiceByFindRequestDto(
    findRequestDto: FindRequestDto,
    customOption: FindManyOptions<any> = {},
  ): Promise<FindResponseDto<Entity>> {
    const findParams = findRequestDto.getFindParam(customOption);

    // console.log(findParams);

    // const totalRecord = await this.repository.count(findParams);

    const [data, totalRecord] = await this.repository.findAndCount(findParams);

    const totalPage = Math.floor(
      totalRecord % findRequestDto.count > 0
        ? totalRecord / findRequestDto.count + 1
        : totalRecord / findRequestDto.count,
    );

    const meta = {
      page: +findRequestDto.page,
      count: +findRequestDto.count,
      filter: findRequestDto.filter,
      sort: findRequestDto.sort,
      totalRecord,
      totalPage,
    };

    return new FindResponseDto(meta, data);
  }

  async responseEmptyFindAll(
    findRequestDto: FindRequestDto,
  ): Promise<FindResponseDto<Entity>> {
    const totalRecord = 0;

    const totalPage = Math.floor(
      totalRecord % findRequestDto.count > 0
        ? totalRecord / findRequestDto.count + 1
        : totalRecord / findRequestDto.count,
    );

    const meta = {
      page: +findRequestDto.page,
      count: +findRequestDto.count,
      filter: findRequestDto.filter,
      sort: findRequestDto.sort,
      totalRecord,
      totalPage,
    };

    return new FindResponseDto(meta, []);
  }

  async createCoreService(createDto: any, user: number | 'system') {
    // this.repository.exist

    if (user === 'system') {
      user = 0;
    }

    if (Array.isArray(createDto)) {
      createDto.forEach((item) => {
        item.createdUser = user;
        item.updatedUser = user;

        item.createdAt = new Date();
        item.updatedAt = new Date();
      });
    } else {
      createDto.createdUser = user;
      createDto.updatedUser = user;

      createDto.createdAt = new Date();
      createDto.updatedAt = new Date();
    }

    const newObject = this.repository.create(createDto);
    return await this.repository.save(newObject, { transaction: true });
  }

  async updateCoreService(
    criteria: any,
    updateDto: any,
    user: number | 'system',
  ) {
    // this.repository.exist

    if (user === 'system') {
      user = 0;
    }

    updateDto.updatedAt = new Date();
    updateDto.updatedUser = user;

    return await this.repository.update(criteria, updateDto);
  }

  async find(findOption: FindManyOptions) {
    return await this.repository.find(findOption);
  }

  async exist(findOption: FindManyOptions) {
    return await this.repository.exist(findOption);
  }

  createMessage<T>(data?: T) {
    const returnMessage: ReturnMessageDto<T> = {
      statusCode: HttpStatus.CREATED,
      message: 'Tạo mới thành công',
      data,
    };
    return this.returnMessage(returnMessage);
  }

  updateMessage<T>(data?: T) {
    const returnMessage: ReturnMessageDto<T> = {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Cập nhật thành công',
      data,
    };
    return this.returnMessage(returnMessage);
  }

  deleteMessage() {
    const returnMessage: ReturnMessageDto<null> = {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Xoá thành công',
    };
    return this.returnMessage(returnMessage);
  }

  returnMessage<T>(returnMessage: ReturnMessageDto<T>): ReturnMessageDto<T> {
    return returnMessage;
  }

  preCheckAuth(req: AuthRequest) {
    if (req.user.userId) {
      return req.user.userId;
    } else {
      throw new BadRequestException('User not found');
    }
  }
}
