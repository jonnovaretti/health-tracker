import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import {
  Body,
  Controller,
  Get,
  HttpException, HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthorizerGuard } from '../../auth/guards/cognito-authorizer.guard';
import { AuthService } from '../../auth/services/auth.service';
import { ConfirmUserDto } from '../dto/confirm-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UsersService } from '../services/users.service';
import {
  addAccessTokenToCookies,
  addRefreshTokenToCookies,
} from '../utils/cookies';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

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
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    try {
      const authenticationReponse =
        await this.authService.authenticate(loginUserDto);

      addAccessTokenToCookies(response, authenticationReponse.accessToken);
      addRefreshTokenToCookies(response, authenticationReponse.refreshToken);

      response.send(authenticationReponse)
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
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: error.message,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
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
