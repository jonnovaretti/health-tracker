import { AuthService } from 'src/auth/services/auth.service';
import { Controller, Get, Post, Body, Param, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service'; 
import { ConfirmUserDto } from '../dto/confirm-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthorizerGuard } from 'src/auth/guards/cognito-authorizer.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Post('confirm')
  @UsePipes(new ValidationPipe())
  async confirmUser(@Body() confirmUserDto: ConfirmUserDto) {
    await this.authService.confirmUser(confirmUserDto); 
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.authenticate(loginUserDto);
  }

  @Get(':userId')
  @UseGuards(AuthorizerGuard)
  async findOne(@Param('userId') userId: string) {
    return this.usersService.findByExternalId(userId);
  }
}
