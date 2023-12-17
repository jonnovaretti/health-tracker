import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Module({
  imports: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
