import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AuthInterface,
  SigninResponse,
  SignupResponse,
  signinData,
  signupData,
} from '../interfaces/signup.interface';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/user/services/user.service';
import {
  BAD_CREDENTIALS,
  PASSWORDS_NOT_MATCH,
  USER_EXIST,
} from 'src/common/constants/errorMessages.constant';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { TokenType } from 'src/common/constants/token.constant';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async signup(payload: signupData): Promise<SignupResponse> {
    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      dateOfBirth,
    } = payload;

    //check user with same email
    const userExist = await this.userService.findByEmail(email);
    if (userExist) {
      throw new BadRequestException(USER_EXIST);
    }

    // check passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException(PASSWORDS_NOT_MATCH);
    }

    // create password hash
    const passwordHash = bcrypt.hashSync(
      password,
      +this.configService.get('PASSWORD_HASH_SALT'),
    );

    // create user
    const user = await this.userService.createUser({
      firstName,
      lastName,
      email,
      password: passwordHash,
      dateOfBirth,
    });

    // generate token
    const token = await this.tokenService.generateToken(
      user.id,
      TokenType.ACCESS,
    );

    return {
      token,
    };
  }

  async signin(payload: signinData): Promise<SigninResponse> {
    const { email, password } = payload;

    // check user registred or no
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(BAD_CREDENTIALS);
    }

    // check password with existing user passwor hash
    const isPasswordMatching = await this.isPasswordMatching(
      password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException(BAD_CREDENTIALS);
    }

    const token = await this.tokenService.generateToken(
      user.id,
      TokenType.ACCESS,
    );

    const { firstName, lastName, dateOfBirth } = user;

    return {
      token,
      user: {
        firstName,
        lastName,
        email,
        dateOfBirth,
      },
    };
  }

  async isPasswordMatching(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
