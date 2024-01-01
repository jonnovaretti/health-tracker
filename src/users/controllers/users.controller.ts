import { AuthService } from '../../auth/services/auth.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Response,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { ConfirmUserDto } from '../dto/confirm-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthorizerGuard } from '../../auth/guards/cognito-authorizer.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import {
  addAccessTokenToCookies,
  addRefreshTokenToCookies,
} from '../utils/cookies';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof UsernameExistsException) {
        throw new HttpException(
          'There is an account using this e-mail',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'An internal error has happened, please try again',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('confirm')
  @UsePipes(new ValidationPipe())
  async confirmUser(@Body() confirmUserDto: ConfirmUserDto) {
    await this.authService.confirmUser(confirmUserDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto, @Response() response) {
    try {
      const authenticationReponse =
        await this.authService.authenticate(loginUserDto);

      addAccessTokenToCookies(response, authenticationReponse.accessToken);
      addRefreshTokenToCookies(response, authenticationReponse.refreshToken);

      return authenticationReponse;
    } catch (error) {
      if (error.code == 'NotAuthorizedException') {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'E-mail or password are invalid',
          },
          HttpStatus.UNAUTHORIZED,
          {
            cause: error,
          },
        );
      }
    }
  }

  @Get(':userId')
  @UseGuards(AuthorizerGuard)
  async findOne(@Param('userId') userId: string) {
    return this.usersService.findByExternalId(userId);
  }
}
