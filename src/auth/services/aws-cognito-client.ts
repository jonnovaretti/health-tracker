import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { AuthenticationResult } from './types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsCognitoClient {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<string> {
    let userSub: string;

    await new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'name', Value: name })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            userSub = result.userSub;
            resolve(result);
          }
        },
      );
    });

    return userSub;
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticationResult> {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationData = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    const result = await new Promise<CognitoUserSession>((resolve, reject) => {
      userCognito.authenticateUser(authenticationData, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });

    return {
      accessToken: result.getAccessToken().getJwtToken(),
      refreshToken: result.getRefreshToken().getToken(),
    };
  }

  async confirmUser(email: string, code: string) {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    await new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
