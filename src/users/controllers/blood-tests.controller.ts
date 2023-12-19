import { Controller, Post, Body, Param, ValidationPipe, UsePipes, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateBloodTestDto } from '../dto/create-blood-test.dto';

@Controller('users/:userId/blood-tests')
export class BloodTestsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Param('userId') userId: string, @Body() createBloodTestDto: CreateBloodTestDto) {
    await this.usersService.createBloodTest(userId, createBloodTestDto);
  }
}
