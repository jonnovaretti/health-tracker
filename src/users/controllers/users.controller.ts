import { AuthService } from '../../auth/services/auth.service'
import { Controller, Get, Post, Body, Param, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service'; 
import { ConfirmUserDto } from '../dto/confirm-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthorizerGuard } from '../../auth/guards/cognito-authorizer.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.usersService.create(createUserDto);
    }
    catch (error) {
      if (error.code === "UsernameExistsException") {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          message: 'There is an account using this e-mail',
        }, HttpStatus.BAD_REQUEST, {
            cause: error
          });
      } else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'There is an account using this e-mail',
        }, HttpStatus.INTERNAL_SERVER_ERROR, {
            cause: error
          });
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
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      return await this.authService.authenticate(loginUserDto);
    }
    catch (error) {
      if (error.code == "NotAuthorizedException") {
        throw new HttpException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'E-mail or password are invalid',
        }, HttpStatus.UNAUTHORIZED, {
            cause: error
          });
      }
    }
  }

  @Get(':userId')
  @UseGuards(AuthorizerGuard)
  async findOne(@Param('userId') userId: string) {
    return this.usersService.findByExternalId(userId);
  }
}
