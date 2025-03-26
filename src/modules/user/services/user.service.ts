import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser, UserFilter, UserInterface } from '../interfaces/user.interface';
import { UserRepository } from '../repository/user.repository';

import {
  ALREADY_FRIEND,
  FRIEND_REQUEST_IS_PENDING,
  FRIEND_REQUEST_NOT_FOUND,
  FRIEND_REQUEST_SENT,
  RECEIVER_NOT_FOUND,
} from 'src/common/constants/errorMessages.constant';
import {
  FRIEND_REQUEST_SENDED,
  SUCCESSFULLY_HANDLED,
} from 'src/common/constants/successMessages.constant';
import { RelationRepository } from '../repository/relation.repository';
import { IRelation } from '../interfaces/relation.interface';
import { RelationStatusHandle } from 'src/common/constants/relations.constant';

@Injectable()
export class UserService implements UserInterface {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly relationRepository: RelationRepository,
  ) {}

  async findByEmail(email: string): Promise<IUser> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: IUser): Promise<IUser> {
    return this.userRepository.createUser(data);
  }

  async getUserList(userId: number, filter: UserFilter): Promise<IUser[]> {
    return await this.userRepository.getUserList(userId, filter);
  }

  async getFriendsList(userId: number): Promise<IUser[]> {
    return await this.userRepository.getFriendsList(userId);
  }

  async sendFrinedRequest(
    senderId: number,
    receiverId: number,
  ): Promise<string> {
    // check receiver is exist or no
    const receiverUser = await this.userRepository.findById(receiverId);

    if (!receiverUser) {
      throw new BadRequestException(RECEIVER_NOT_FOUND);
    }

    // check friend request  sent or no
    const alreadySended = await this.relationRepository.checkFriendRequestState(
      senderId,
      receiverId,
    );

    if (alreadySended && alreadySended > 0) {
      throw new BadRequestException(FRIEND_REQUEST_SENT);
    }

    // check friend request  sent to me or no
    const isPending = await this.relationRepository.checkFriendRequestState(
      receiverId,
      senderId,
    );

    if (isPending && isPending > 0) {
      throw new BadRequestException(FRIEND_REQUEST_IS_PENDING);
    }

    // check already friend or no
    const alreadyFriend = await this.relationRepository.checkIsFriend(
      senderId,
      receiverId,
    );

    if (alreadyFriend && alreadyFriend > 0) {
      throw new BadRequestException(ALREADY_FRIEND);
    }

    // send request
    await this.relationRepository.sendFriendRequest(senderId, receiverId);
    return FRIEND_REQUEST_SENDED;
  }

  async getFriendRequestList(userId: number): Promise<IRelation[]> {
    return await this.relationRepository.getFriendRequestList(userId);
  }

  async handleFriendRequest(
    userId: number,
    status: RelationStatusHandle,
    requestId: number,
  ): Promise<string> {
    // check ther is request or no
    const friendRequest = await this.relationRepository.checkFriendRequest(
      userId,
      requestId,
    );

    if (!friendRequest) {
      throw new BadRequestException(FRIEND_REQUEST_NOT_FOUND);
    }

    // handle status and use action by status
    status === RelationStatusHandle.ACCEPTED
      ? await this.relationRepository.acceptFriendRequest(requestId)
      : await this.relationRepository.rejectFriendRequest(requestId);

    return SUCCESSFULLY_HANDLED;
  }
}
