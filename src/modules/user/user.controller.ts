import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { UsersFilterParamsDto } from './dto/filter.dto';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { IUser } from './interfaces/user.interface';
import { HandleFriendRequestDto, UserIdDto } from './dto/friendRequest.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsersList(
    @CurrentUser() user: IUser,
    @Query() params: UsersFilterParamsDto,
  ) {
    return this.userService.getUserList(user.id, params);
  }

  @Post()
  sendRequest(
    @CurrentUser() user: IUser,
    @Query() params: UsersFilterParamsDto,
  ) {
    return this.userService.getUserList(user.id, params);
  }

  @Get('friends')
  getFriendsList(@CurrentUser() user: IUser) {
    return this.userService.getFriendsList(user.id);
  }

  @Post('friend/request')
  sendFriendRequest(@CurrentUser() user: IUser, @Body() data: UserIdDto) {
    return this.userService.sendFrinedRequest(user.id, data.receiverId);
  }

  @Get('friend/request')
  getFriendRequestList(@CurrentUser() user: IUser) {
    return this.userService.getFriendRequestList(user.id);
  }

  @Put('friend/request/:requestId')
  handleFriendRequest(
    @CurrentUser() user: IUser,
    @Body() data: HandleFriendRequestDto,
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    return this.userService.handleFriendRequest(
      user.id,
      data.status,
      requestId,
    );
  }
}
