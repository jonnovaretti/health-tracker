import { AuthenticationTokenDto } from '../dto/authentication-token.dto';
import {
  CreateUserParams,
  ConfirmUserParams,
  LoginParams,
} from '../../users/utils/types';
import { AuthenticationResult } from './types';
import { AwsCognitoClient } from './aws-cognito-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private awsCognitoClient: AwsCognitoClient) {}

  async registerUser(createUserParams: CreateUserParams): Promise<string> {
    const { name, email, password } = createUserParams;
    return await this.awsCognitoClient.createUser(name, email, password);
  }

  async authenticate(loginParams: LoginParams): Promise<AuthenticationResult> {
    const authenticationResponse: AuthenticationTokenDto =
      await this.awsCognitoClient.authenticate(
        loginParams.email,
        loginParams.password,
      );

    return authenticationResponse;
  }

  async confirmUser(confirmUserParams: ConfirmUserParams) {
    await this.awsCognitoClient.confirmUser(
      confirmUserParams.email,
      confirmUserParams.code,
    );
  }
}
