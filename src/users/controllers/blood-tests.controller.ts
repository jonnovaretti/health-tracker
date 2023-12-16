import { Controller, Post, Body, Param, ValidationPipe, UsePipes, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateBloodTestDto } from '../dto/create-blood-test.dto';

@Controller('users/:id/blood-tests')
export class BloodTestsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Param('id', ParseIntPipe) id: number, @Body() createBloodTestDto: CreateBloodTestDto) {
    await this.usersService.createBloodTest(id, createBloodTestDto);
  }
}
