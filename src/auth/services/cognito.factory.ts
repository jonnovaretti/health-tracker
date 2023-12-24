import { Injectable } from "@nestjs/common";
import { CognitoUserPool } from "amazon-cognito-identity-js";

@Injectable()
export class CognitoFactory {
  constructor() {}

  createUserPool(userPoolId: string, clientId: string): CognitoUserPool {
    return new CognitoUserPool({
      UserPoolId: userPoolId, 
      ClientId: clientId, 
    });
  }
}
