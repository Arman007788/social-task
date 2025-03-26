import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import {
  AGE_NUMBER_VALIDATION,
  FIRST_NAME_VALIDATION_ERROR,
  LAST_NAME_VALIDATION_ERROR,
} from 'src/common/constants/validation.constants';

export class UsersFilterParamsDto {
  @IsString()
  @IsOptional()
  @Matches(/^\S+$/, { message: FIRST_NAME_VALIDATION_ERROR })
  firstName: string;

  @IsString()
  @IsOptional()
  @Matches(/^\S+$/, { message: LAST_NAME_VALIDATION_ERROR })
  lastName: string;

  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = Number(value);
    if (value && isNaN(parsedValue)) {
      throw new BadRequestException(AGE_NUMBER_VALIDATION);
    }
    return parsedValue || null;
  })
  @IsNumber()
  age: number;
}
