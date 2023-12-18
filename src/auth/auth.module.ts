import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenValidatorService } from './services/token-validator.service';

@Module({
  imports: [AuthService],
  exports: [AuthService],
  providers: [TokenValidatorService]
})
export class AuthModule {}
