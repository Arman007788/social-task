import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignupDto } from './dto/signup.dto';
import { Public } from 'src/common/constants/auth.constant';
import { SigninDto } from './dto/signin.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  signup(@Body() sugnupData: SignupDto) {
    return this.authService.signup(sugnupData);
  }

  @Post('signin')
  @Public()
  signin(@Body() signinData: SigninDto) {
    return this.authService.signin(signinData);
  }
}
