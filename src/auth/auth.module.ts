import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenValidatorService } from './services/token-validator.service';
import { AwsCognitoClient } from './services/aws-cognito-client';

@Module({
  exports: [AuthService],
  providers: [AuthService, TokenValidatorService, AwsCognitoClient]
})
export class AuthModule {}
