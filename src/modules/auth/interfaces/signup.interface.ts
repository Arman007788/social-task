import { IUser } from 'src/modules/user/interfaces/user.interface';

// auth service interface
export interface AuthInterface {
  signup(signupData: signupData): Promise<SignupResponse>;
  signin(signinData: signinData): Promise<SignupResponse>;
}

export interface signupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
}

export interface signinData {
  email: string;
  password: string;
}

export interface SignupResponse {
  token: string;
}

export interface SigninResponse extends SignupResponse {
  user: Partial<IUser>;
}
