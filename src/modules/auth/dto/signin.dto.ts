import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import {
  PASSWORD_CHARACTERS_ERROR,
  PASSWORD_LENGTH_ERROR,
} from 'src/common/constants/validation.constants';

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: PASSWORD_LENGTH_ERROR })
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/, {
    message: PASSWORD_CHARACTERS_ERROR,
  })
  password: string;
}
