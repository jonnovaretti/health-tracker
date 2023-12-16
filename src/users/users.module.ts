import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service'; 
import { UsersController } from './controllers/users.controller';
import { BloodTest } from './entities/blood-test.entity';
import { BloodTestsController } from './controllers/blood-tests.controller';
import { AuthUsersService } from './services/auth-users.service';

@Module({
  imports: [ TypeOrmModule.forFeature([User, BloodTest]) ],
  controllers: [UsersController, BloodTestsController],
  providers: [UsersService, AuthUsersService],
})
export class UsersModule {}
