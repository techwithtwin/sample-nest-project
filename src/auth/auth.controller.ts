import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { AuthService } from './providers/auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthTypeEnum } from './enums/auth-type.enum';

@Auth(AuthTypeEnum.None)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signinDto: SignInDto) {
    return this.authService.signIn(signinDto);
  }
}
