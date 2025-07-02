import { FilterDto, SortDto } from './find-request.dto';

export class FindResponseDto<T> {
  constructor(meta, data) {
    this.meta = meta;
    this.data = data;
  }
  meta: {
    page: number; // default 0
    count: number;
    filter?: FilterDto;
    sort?: SortDto;
    totalRecord: number;
    totalPage: number;
  };
  data: T[];
}
