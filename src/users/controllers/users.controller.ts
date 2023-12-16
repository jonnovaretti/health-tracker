import { Controller, Get, Post, Body, Param, ValidationPipe, UsePipes, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service'; 
import { ConfirmUserDto } from '../dto/confirm-user.dto';
import { AuthUsersService } from '../services/auth-users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthUsersService,
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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(+id);
  }
}
