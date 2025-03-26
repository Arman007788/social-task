import {
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenInterface } from '../interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from 'src/common/constants/token.constant';
import { ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwtConfig.service';
import { UNAUTHORIZED } from 'src/common/constants/errorMessages.constant';

@Injectable()
export class TokenService implements TokenInterface {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  async generateToken(userId: number, tokenType: string): Promise<string> {
    let jwtPayload: string;
    const jwtConfig = this.jwtConfigService.getJwtConfigs();

    // check token by action type
    switch (tokenType) {
      case TokenType.ACCESS:
        jwtPayload = this.generateJwtToken(
          userId,
          jwtConfig.jwtAccessTokenKey,
          jwtConfig.jwtAccessTokenExpiresIn,
        );
        break;
      default:
        throw new NotImplementedException();
    }

    return jwtPayload;
  }

  generateJwtToken(userId: number, key: string, expiresIn: string): string {
    return this.jwtService.sign({ id: userId }, { secret: key, expiresIn });
  }

  async verifyAccessToken(payload: string): Promise<any> {
    try {
      const jwtConfig = this.jwtConfigService.getJwtConfigs();
      return this.jwtService.verify(payload, {
        secret: jwtConfig.jwtAccessTokenKey,
      });
    } catch (err) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }
  }
}
