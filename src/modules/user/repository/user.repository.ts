import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/modules/database/database.service';
import { IUser, UserFilter } from '../interfaces/user.interface';
import { DatabaseException } from 'src/common/database.exception';
import {
  FRIENDS_LIST_FETCH_ERROR,
  USER_CREATION_ERROR,
  USER_FETCH_EMAIL_ERROR,
  USER_FETCH_ID_ERROR,
  USER_LIST_FETCH_ERROR,
} from 'src/common/constants/errorDatabase.constants';

@Injectable()
export class UserRepository {
  private table_name = 'users';

  constructor(private readonly database: DatabaseService) {}

  async findByEmail(email: string): Promise<IUser> {
    try {
      const result = await this.database.query(
        `SELECT * FROM ${this.table_name} WHERE email = $1`,
        [email],
      );
      return result?.[0];
    } catch (error) {
      throw new DatabaseException(USER_FETCH_EMAIL_ERROR);
    }
  }

  async findById(id: number): Promise<IUser> {
    try {
      const result = await this.database.query(
        `SELECT * FROM ${this.table_name} WHERE id = $1`,
        [id],
      );
      return result?.[0];
    } catch (error) {
      throw new DatabaseException(USER_FETCH_ID_ERROR);
    }
  }

  async createUser(userData: IUser): Promise<IUser> {
    try {
      const { firstName, lastName, email, password, dateOfBirth } = userData;
      const user = await this.database.query(
        `INSERT INTO ${this.table_name} ("firstName", "lastName", email, password, "dateOfBirth") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [firstName, lastName, email, password, dateOfBirth],
      );

      if (!user?.[0]) {
        throw new Error('User not created');
      }

      return user[0];
    } catch (error) {
      throw new DatabaseException(USER_CREATION_ERROR);
    }
  }

  async getUserList(
    currentUserId: number,
    filter: UserFilter,
  ): Promise<IUser[]> {
    try {
      const conditions = [`id != $1`]; // Exclude current user
      const values: any[] = [currentUserId]; // First value is current user ID
      let paramIndex = 2; // Start index for SQL placeholders
      if (filter?.firstName) {
        conditions.push(`"firstName" ILIKE $${paramIndex}`);
        values.push(`%${filter.firstName}%`);
        paramIndex++;
      }

      if (filter?.lastName) {
        conditions.push(`"lastName" ILIKE $${paramIndex}`);
        values.push(`%${filter.lastName}%`);
        paramIndex++;
      }
      if (filter?.age) {
        conditions.push(
          `EXTRACT(YEAR FROM AGE("dateOfBirth")) = $${paramIndex}`,
        );
        values.push(Number(filter.age));
        paramIndex++;
      }

      const query = `
        SELECT 
          id, "firstName", "lastName", "email", "dateOfBirth"
        FROM ${this.table_name}
        WHERE ${conditions.join(' AND ')}
      `;

      const users = await this.database.query(query, values);
      return users;
    } catch (error) {
      throw new DatabaseException(USER_LIST_FETCH_ERROR);
    }
  }

  async getFriendsList(userId: number): Promise<IUser[]> {
    try {
      const user = await this.database.query(
        `SELECT   
            id, "firstName", "lastName", "email", "dateOfBirth"
        FROM ${this.table_name} u
        JOIN friend_requests f ON (u.id = f.sender_id OR u.id = f.receiver_id)
        WHERE (f.sender_id = $1 OR f.receiver_id = $1) AND f.status = 'accepted'`,
        [userId],
      );

      return user[0];
    } catch (error) {
      throw new DatabaseException(FRIENDS_LIST_FETCH_ERROR);
    }
  }
}
