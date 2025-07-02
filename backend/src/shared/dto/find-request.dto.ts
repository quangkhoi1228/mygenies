import { BadRequestException } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Request } from 'express';
import {
  Between,
  Equal,
  FindManyOptions,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
} from 'typeorm';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Count per page', example: 12 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  count: number = 12;

  @ApiPropertyOptional({
    description: 'Filter',
    example: '{"id":{"operator":"=","value":1}}',
  })
  @IsOptional()
  @IsString()
  filter: string = '{}';

  @ApiPropertyOptional({ description: 'Sort', example: '{"id":"desc"}' })
  @IsOptional()
  @IsString()
  sort: string = '{}';
}

export class FilterItemValueDto {
  operator:
    | '='
    | '>'
    | '<'
    | '>='
    | '<='
    | '><'
    | 'not'
    | 'in'
    | 'notIn'
    | 'like'
    | 'ilike' // case insensitive;
    | 'iLikeUnaccent'
    | 'jsonILikeUnaccent'
    | 'contain';

  value: any | any[] | null;
}
export class FilterDto {
  [column: string]: FilterItemValueDto;
}

export class SortDto {
  [column: string]: 'asc' | 'desc';
}

export class FindRequestDto {
  constructor(req?: Request) {
    // if (req instanceof PaginationDto) {
    //   this.page = req?.page ? +req.page : 1;
    //   this.count = req?.count ? +req.count : 12;
    //   this.filter = req?.filter ? JSON.parse(req?.filter.toString()) : {};
    //   this.sort = req?.sort ? JSON.parse(req?.sort.toString()) : {};
    // } else if (req instanceof Request) {
    this.page = req?.query?.page ? +req.query.page : 1;
    this.count = req?.query?.count ? +req.query.count : 12;
    this.filter = req?.query?.filter
      ? JSON.parse(req?.query?.filter.toString())
      : {};
    this.sort = req?.query?.sort ? JSON.parse(req?.query?.sort.toString()) : {};
    // }
  }

  @IsNumber()
  page: number; // default 0

  @IsNumber()
  count: number;

  filter?: FilterDto;

  sort?: SortDto;

  groupBy?: string;

  getFindParam(customOption: { [key: string]: any } = {}): FindManyOptions {
    const whereParams = this.getFilterParam(this.filter);
    const orderParam = this.getSortParam(this.sort);

    return {
      skip: (Number(this.page) - 1) * Number(this.count),

      take: this.count,

      where: whereParams,

      order: orderParam,

      ...customOption,
    };
  }

  standardSqlValue(value: any, prefix?: string, suffix?: string) {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      if (prefix) {
        value = `${prefix}${value}`;
      }

      if (suffix) {
        value = `${value}${suffix}`;
      }

      return `'${value}'`;
    } else {
      return value;
    }
  }

  getFilterStatement() {
    const filter = this.filter;

    const whereClause = [];
    Object.entries(filter).forEach(([column, { operator, value }]) => {
      let queryColumn = column.split('.').join('"."');

      if (!column.includes('"')) {
        queryColumn = `"${queryColumn}"`;
      }

      // console.log(column, queryColumn);
      switch (operator) {
        case '>':
        case '<':
        case '>=':
        case '<=':
        case '=':
        case 'not':
          whereClause.push(
            ` ${queryColumn} ${operator} ${this.standardSqlValue(value)}`,
          );
          break;
        case '><':
          if (value?.length === 2) {
            whereClause.push(
              ` ${queryColumn} BETWEEN  ${this.standardSqlValue(
                value[0],
              )} AND ${this.standardSqlValue(value[1])}`,
            );
          } else {
            throw new BadRequestException('Filter between wrong');
          }
          break;

        case 'in':
          if (Array.isArray(value)) {
            whereClause.push(
              ` ${queryColumn} IN  (${value
                .map((item) => this.standardSqlValue(item))
                .join(`,`)})`,
            );
          } else {
            throw new BadRequestException('Filter in wrong');
          }
          break;
        case 'notIn':
          if (Array.isArray(value)) {
            whereClause.push(
              ` ${queryColumn} NOT IN  (${value
                .map((item) => this.standardSqlValue(item))
                .join(`,`)})`,
            );
          } else {
            throw new BadRequestException('Filter in wrong');
          }
          break;

        case 'like':
          whereClause.push(
            ` ${queryColumn} ${operator} ${this.standardSqlValue(
              value,
              '%',
              '%',
            ).toLowerCase()}`,
          );
          break;

        case 'ilike':
          if (value === null) {
          } else {
            whereClause.push(
              ` ${queryColumn} ${operator} ${this.standardSqlValue(
                value,
                '%',
                '%',
              ).toLowerCase()}`,
            );
          }
          break;

        case 'iLikeUnaccent':
          if (value === null) {
          } else {
            whereClause.push(
              `LOWER(unaccent(${queryColumn})) ILIKE LOWER(unaccent('%${value}%'))`,
            );
          }
          break;
        case 'contain':
          if (value === null) {
          } else {
            whereClause.push(`${queryColumn} @> '${value}'`);
          }
          break;

        default:
          break;
      }
    });

    const originWhereStatement = whereClause.reduce((pre, current, index) => {
      if (index == 0) {
        return ` ${current}`;
      } else {
        return (pre += ` and ${current}`);
      }
    }, '');

    return {
      originWhereStatement,
      whereStatement: ` where ${originWhereStatement}`,
    };
  }

  getSortStatement() {
    const sort = this.sort;

    const sortClause = [];
    Object.entries(sort).forEach(([column, value]) => {
      const queryColumn = column.split('.').join('"."');
      switch (value) {
        case 'asc':
          sortClause.push(` "${queryColumn}" ASC `);
          break;
        case 'desc':
          sortClause.push(` "${queryColumn}" DESC `);

          break;

        default:
          break;
      }
    });

    const originSortStatement = sortClause.reduce((pre, current, index) => {
      if (index == 0) {
        return ` ${current}`;
      } else {
        return (pre += ` , ${current}`);
      }
    }, '');

    return {
      originSortStatement,
      sortStatement:
        originSortStatement.trim() !== ''
          ? ` order by ${originSortStatement}`
          : '',
    };
  }

  getSortParam(sort: SortDto) {
    const orderParams = sort;
    // console.log('sort: ', sort);
    // Object.entries(sort).forEach(([column, value]) => {
    //   let operatorParam;
    //   switch (value) {
    //     case 'asc':
    //       operatorParam = 'ASC';
    //       break;
    //     case 'desc':

    //     default:
    //       operatorParam = 'DESC';
    //       break;
    //   }

    //   const columnSplit = column.split('.');

    //   if (columnSplit.length > 1) {
    //     let current = { [columnSplit.pop()]: operatorParam };

    //     for (let i = columnSplit.length - 1; i >= 0; i--) {
    //       if (i === 0) {
    //         orderParams[columnSplit[i]] = current;
    //       } else {
    //         current = { [columnSplit[i]]: current };
    //       }
    //     }
    //   } else {
    //     orderParams[column] = operatorParam;
    //   }
    // });

    if (Object.keys(orderParams).length === 0) {
      orderParams['id'] = 'desc';
    }

    // console.log('sort: ', orderParams);

    return orderParams;
  }

  getFilterParam(filter: FilterDto) {
    const whereParams = {};
    Object.entries(filter).forEach(([column, { operator, value }]) => {
      let operatorParam;
      switch (operator) {
        case '>':
          operatorParam = MoreThan(value);
          break;
        case '<':
          operatorParam = LessThan(value);
          break;
        case '>=':
          operatorParam = MoreThanOrEqual(value);
          break;
        case '<=':
          operatorParam = LessThanOrEqual(value);
          break;

        case '=':
          if (value === null) {
            operatorParam = IsNull();
          } else {
            operatorParam = Equal(value);
          }
          break;

        case 'not':
          if (value === null) {
            operatorParam = Not(IsNull());
          } else {
            operatorParam = Not(Equal(value));
          }
          break;

        case '><':
          if (value?.length === 2) {
            operatorParam = Between(value[0], value[1]);
          } else {
            throw new BadRequestException('Filter between wrong');
          }
          break;

        case 'in':
          if (Array.isArray(value)) {
            operatorParam = In(value);
          } else {
            throw new BadRequestException('Filter in wrong');
          }
          break;

        case 'notIn':
          if (Array.isArray(value)) {
            operatorParam = Not(In(value));
          } else {
            throw new BadRequestException('Filter not in wrong');
          }
          break;

        case 'like':
          if (value === null) {
            operatorParam = IsNull();
          } else {
            operatorParam = Like(`%${value}%`);
          }
          break;

        case 'ilike':
          if (value === null) {
            operatorParam = IsNull();
          } else {
            operatorParam = ILike(`%${value}%`);
          }
          break;

        case 'iLikeUnaccent':
          if (value === null) {
            operatorParam = IsNull();
          } else {
            operatorParam = Raw(
              (alias) =>
                `LOWER(unaccent(${alias})) ILIKE LOWER(unaccent('%${value}%'))`,
            );
          }
          break;
        case 'jsonILikeUnaccent':
          if (value === null) {
            operatorParam = IsNull();
          } else {
            operatorParam = Raw(
              (alias) =>
                `LOWER(unaccent(${alias} ->> '${
                  column.split('->')[1]
                }')) ILIKE LOWER(unaccent('%${value}%'))`,
            );
          }
          break;
        case 'contain':
          if (value === null) {
            operatorParam = IsNull();
          } else {
            operatorParam = Raw((alias) => `${alias} @> '%${value}%'`);
          }
          break;

        default:
          operatorParam = Equal(value);
          break;
      }

      const columnSplit = column.split('.');

      if (columnSplit.length > 1) {
        let current = { [columnSplit.pop()]: operatorParam };

        for (let i = columnSplit.length - 1; i >= 0; i--) {
          if (i === 0) {
            whereParams[columnSplit[i]] = current;
          } else {
            current = { [columnSplit[i]]: current };
          }
        }
      } else if (column.includes('->')) {
        whereParams[column.split('->')[0]] = operatorParam;
      } else {
        whereParams[column] = operatorParam;
      }
    });

    return whereParams;
  }
}
