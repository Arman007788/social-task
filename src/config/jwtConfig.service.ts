import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  getJwtConfigs() {
    return {
      jwtAccessTokenKey: this.configService.get<string>('JWT_ACCESS_TOKEN_KEY'),
      jwtAccessTokenExpiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRES_IN',
      ),
    };
  }
}
