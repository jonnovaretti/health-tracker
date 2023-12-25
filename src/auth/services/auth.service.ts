import { AuthenticationTokenDto } from "../dto/authentication-token.dto";
import { CreateUserParams, ConfirmUserParams, LoginParams } from "../../users/utils/types";
import { AuthenticationResult } from "./types";
import { AwsCognitoClient } from "./aws-cognito-client";

export class AuthService {
  constructor(private awsCognitoClient: AwsCognitoClient) {
    console.log(awsCognitoClient);
  }

  async registerUser(createUserParams: CreateUserParams): Promise<string> {
    const { name, email, password } = createUserParams;
    return await this.awsCognitoClient.createUser(name, email, password);
  }

  async authenticate(loginParams: LoginParams): Promise<AuthenticationResult> {
    let authenticationToken: AuthenticationTokenDto;
    
    authenticationToken = await this.awsCognitoClient.authenticate(
      loginParams.email,
      loginParams.password
    )

    return authenticationToken;
  }

  async confirmUser(confirmUserParams: ConfirmUserParams) {
    await this.awsCognitoClient.confirmUser(
      confirmUserParams.email,
      confirmUserParams.code
    )
  }
}
