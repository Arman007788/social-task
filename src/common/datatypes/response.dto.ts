import { Expose } from 'class-transformer';

export class ResponseDto<T> {
  @Expose()
  data: T;

  @Expose()
  message: string;

  @Expose()
  statusCode: number;
}
