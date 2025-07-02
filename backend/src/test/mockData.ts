import { Request } from 'express';
import { AuthRequest } from '../modules/auth/interface/auth-request.interface';
import { MetaType } from '../shared/interfaces/objectMeta.interface';

export const defaultEntityData = {
  createdUser: 0,
  updatedUser: 0,
  createdDate: new Date(),
  updatedDate: new Date(),
};

export const mockRequest = {} as unknown as Request;
export const mockAuthRequest = {
  user: {
    clerkUserId: 'clerkId_1',
    sessionId: '',
    userId: 1,
  },
} as unknown as AuthRequest;

export const mockPaginationMeta = {
  count: 12,
  filter: {},
  page: 1,
  sort: {},
  totalPage: 1,
  totalRecord: 1,
};

export const mockMetaTypeData = [
  { type: MetaType.string, value: 'a' },
  { type: MetaType.array, value: '[]' },
  { type: MetaType.boolean, value: 'true' },
  { type: MetaType.date, value: `${new Date()}` },
  { type: MetaType.number, value: '0' },
  { type: MetaType.object, value: '{}' },
];
