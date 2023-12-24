import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenValidatorService } from './services/token-validator.service';
import { CognitoFactory } from './services/cognito.factory';

@Module({
  imports: [AuthService],
  exports: [AuthService],
  providers: [TokenValidatorService, CognitoFactory]
})
export class AuthModule {}
