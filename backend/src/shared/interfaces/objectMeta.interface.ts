export enum MetaType {
  string = 'string',
  boolean = 'boolean',
  number = 'number',
  date = 'date',
  object = 'object',
  array = 'array',
}

export type MetaTypeMap = {
  [MetaType.string]: string;
  [MetaType.boolean]: boolean;
  [MetaType.number]: number;
  [MetaType.date]: Date;
  [MetaType.object]: Record<string, any>;
  [MetaType.array]: any[];
};

export default interface ObjectMeta {
  [key: string]: { value: any; type: MetaType };
}

export interface NumberRange {
  from: number;
  to: number;
}
