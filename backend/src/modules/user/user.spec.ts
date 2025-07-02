import { MetaType } from '../../shared/interfaces/objectMeta.interface';
import {
  defaultEntityData,
  mockAuthRequest,
  mockMetaTypeData,
} from '../../test/mockData';
import { UserInfo } from './user-info/entities/user-info.entity';
import { User } from './user/entities/user.entity';

export const mockUser: User = {
  id: mockAuthRequest.user.userId,
  clerkId: mockAuthRequest.user.clerkUserId,
  userInfo: [],
  ...defaultEntityData,
};

export const mockUserInfoData: UserInfo[] = [
  ...mockMetaTypeData.map((item, index) => ({
    key: `${item.type}`,
    type: item.type,
    value: item.value,
    user: mockUser,
    id: index + 1,
    ...defaultEntityData,
  })),
  {
    key: MetaType.string,
    type: MetaType.string,
    value: 'user2',
    user: {
      id: 2,
      clerkId: 'clerkId_2',
      userInfo: [],
      ...defaultEntityData,
    },
    id: mockMetaTypeData.length + 1,
    ...defaultEntityData,
  },
];
