import { Controller, Post } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthTypeEnum } from '../enums/auth-type.enum';

@Auth(AuthTypeEnum.None)
@Controller('auth/google-authentication')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post()
  async authenticate(googleTokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(googleTokenDto);
  }
}
