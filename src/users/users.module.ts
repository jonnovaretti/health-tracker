import { AuthService } from 'src/auth/services/auth.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { BloodTest } from './entities/blood-test.entity';
import { BloodTestsController } from './controllers/blood-tests.controller';
import { TokenValidatorService } from 'src/auth/services/token-validator.service';
import { AwsCognitoClient } from 'src/auth/services/aws-cognito-client';

@Module({
  imports: [TypeOrmModule.forFeature([User, BloodTest])],
  controllers: [UsersController, BloodTestsController],
  providers: [
    UsersService,
    AuthService,
    TokenValidatorService,
    AwsCognitoClient,
  ],
})
export class UsersModule {}
