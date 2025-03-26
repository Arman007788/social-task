import { IsEnum, IsNumber } from 'class-validator';
import { RelationStatusHandle } from 'src/common/constants/relations.constant';
import { HANDLE_REQUEST_STATUS_VALIDATION } from 'src/common/constants/validation.constants';

export class UserIdDto {
  @IsNumber()
  receiverId: number;
}

export class HandleFriendRequestDto {
  @IsEnum(RelationStatusHandle, {
    message: HANDLE_REQUEST_STATUS_VALIDATION,
  })
  status: RelationStatusHandle;
}
