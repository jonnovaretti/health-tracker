import { Controller, Post, Body, Param, ValidationPipe, UsePipes, ParseIntPipe } from '@nestjs/common';
import { UsersService } from "../users.service";
import { CreateBloodTestDto } from '../dto/create-blood-test.dto';

@Controller('blood-tests')
export class BloodTestsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users/:id')
  @UsePipes(new ValidationPipe())
  async create(@Param('id', ParseIntPipe) id: number, @Body() createBloodTestDto: CreateBloodTestDto) {
    await this.usersService.createBloodTest(id, createBloodTestDto);
  }
}
