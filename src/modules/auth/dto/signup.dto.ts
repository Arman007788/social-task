import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsString, Matches, MinLength } from 'class-validator';
import {
  FIRST_NAME_VALIDATION_ERROR,
  LAST_NAME_VALIDATION_ERROR,
  PASSWORD_CHARACTERS_ERROR,
  PASSWORD_LENGTH_ERROR,
} from 'src/common/constants/validation.constants';

export class SignupDto {
  @IsString()
  @Matches(/^\S+$/, { message: FIRST_NAME_VALIDATION_ERROR })
  firstName: string;

  @IsString()
  @Matches(/^\S+$/, { message: LAST_NAME_VALIDATION_ERROR })
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: PASSWORD_LENGTH_ERROR })
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/, {
    message: PASSWORD_CHARACTERS_ERROR,
  })
  password: string;

  @IsString()
  confirmPassword: string;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  dateOfBirth: Date;
}
