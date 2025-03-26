import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/modules/database/database.service';
import { DatabaseException } from 'src/common/database.exception';
import { IRelation } from '../interfaces/relation.interface';
import {
  FRIEND_ACCEPT_ERROR,
  FRIEND_CHECK_ERROR,
  FRIEND_CREATE_ERROR,
  FRIEND_REJECT_ERROR,
  FRIEND_REQUEST_CHECK_ERROR,
  FRIEND_REQUEST_LIST_ERROR,
  FRIEND_REQUEST_VERIFICATION_ERROR,
} from 'src/common/constants/errorDatabase.constants';

@Injectable()
export class RelationRepository {
  private table_name = 'relations';

  constructor(private readonly database: DatabaseService) {}

  async sendFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<IRelation[]> {
    try {
      const request = await this.database.query(
        `INSERT INTO ${this.table_name} (sender_id, receiver_id) VALUES ($1, $2) RETURNING *`,
        [senderId, receiverId],
      );
      return request[0];
    } catch (error) {
      throw new DatabaseException(FRIEND_CREATE_ERROR);
    }
  }

  async checkIsFriend(senderId: number, receiverId: number): Promise<number> {
    try {
      const request = await this.database.query(
        `SELECT COUNT(*)
          FROM ${this.table_name}
          WHERE 
          ((sender_id = $1 AND receiver_id = $2 AND status = 'accepted')
           OR (receiver_id = $1 AND sender_id = $2 AND status = 'accepted'))`,
        [senderId, receiverId],
      );
      return Number(request[0]?.count);
    } catch (error) {
      throw new DatabaseException(FRIEND_CHECK_ERROR);
    }
  }

  async checkFriendRequestState(
    senderId: number,
    receiverId: number,
  ): Promise<number> {
    try {
      const request = await this.database.query(
        `SELECT COUNT(*)
          FROM ${this.table_name}
          WHERE (sender_id = $1 AND receiver_id = $2 AND status = 'pending')`,
        [senderId, receiverId],
      );
      return Number(request[0]?.count);
    } catch (error) {
      throw new DatabaseException(FRIEND_REQUEST_CHECK_ERROR);
    }
  }

  async getFriendRequestList(receiverId: number): Promise<IRelation[]> {
    try {
      const request = await this.database.query(
        `SELECT id, sender_id
          FROM ${this.table_name}
          WHERE (receiver_id = $1 AND status = 'pending')`,
        [receiverId],
      );
      return request;
    } catch (error) {
      throw new DatabaseException(FRIEND_REQUEST_LIST_ERROR);
    }
  }

  async checkFriendRequest(
    receiverId: number,
    requestId: number,
  ): Promise<number> {
    try {
      const request = await this.database.query(
        `SELECT COUNT(*)
          FROM ${this.table_name}
          WHERE (id = $1 AND receiver_id = $2 AND status = 'pending')`,
        [requestId, receiverId],
      );
      return Number(request[0]?.count);
    } catch (error) {
      throw new DatabaseException(FRIEND_REQUEST_VERIFICATION_ERROR);
    }
  }

  async acceptFriendRequest(requestId: number): Promise<IRelation> {
    try {
      const request = await this.database.query(
        `UPDATE ${this.table_name} SET status = 'accepted', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [requestId],
      );
      return request[0];
    } catch (error) {
      throw new DatabaseException(FRIEND_ACCEPT_ERROR);
    }
  }

  async rejectFriendRequest(requestId: number): Promise<void> {
    try {
      await this.database.query(
        `DELETE FROM ${this.table_name} WHERE id = $1`,
        [requestId],
      );
    } catch (error) {
      throw new DatabaseException(FRIEND_REJECT_ERROR);
    }
  }
}
