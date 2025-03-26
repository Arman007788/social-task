import { RelationStatusHandle } from 'src/common/constants/relations.constant';
import { IRelation } from './relation.interface';

// user interface
export interface UserInterface {
  findByEmail(email: string): Promise<IUser>;
  createUser(data: IUser): Promise<IUser>;
  getUserList(userId: number, filter?: UserFilter): Promise<IUser[]>;
  getFriendsList(userId: number): Promise<IUser[]>;
  sendFrinedRequest(senderId: number, receiverId: number): Promise<string>;
  getFriendRequestList(userId: number): Promise<IRelation[]>;
  handleFriendRequest(
    userId: number,
    status: RelationStatusHandle,
    requestId: number,
  ): Promise<string>;
}

// user model
export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
}

export interface UserFilter {
  firstName?: string;
  lastName?: string;
  age?: number;
}
