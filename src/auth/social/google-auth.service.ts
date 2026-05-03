import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from '../providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oathClient: OAuth2Client;

  constructor(
    // Inject UsersService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    // inject jwt config
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    // Inject generate tokens provider
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;

    this.oathClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the google token sent by user
      const loginTicket = await this.oathClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // extract the payload from google jwt
      const data = loginTicket.getPayload();

      if (!data || !data.email || !data.given_name)
        throw new UnauthorizedException();

      // if googleid exists generate token
      const existingUser = await this.usersService.findUserByGoogleId(data.sub);
      if (existingUser) {
        return this.generateTokensProvider.generateTokens(existingUser);
      }
      // if not create user and then generate tokens
      const newUser = await this.usersService.createGoogleUser({
        email: data.email,
        firstName: data.given_name,
        lastName: data.family_name || '',
        googleId: data.sub,
      });

      return this.generateTokensProvider.generateTokens(newUser);
    } catch (error) {
      // otherwise throw unauthorized exception
      throw new UnauthorizedException(error);
    }
  }
}
