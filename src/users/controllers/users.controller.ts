import { Controller, Get, Post, Body, Param, ValidationPipe, UsePipes, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service'; 
import { ConfirmUserDto } from '../dto/confirm-user.dto';
import { AuthService } from '../services/auth-users.service';
import { LoginUserDto } from '../dto/login-user.dto';

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(+id);
  }
}
