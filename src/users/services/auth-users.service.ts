import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoUserAttribute, CognitoUserPool, ISignUpResult } from "amazon-cognito-identity-js";
import { CreateUserParams } from "../utils/types";

export class AuthUsersService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser(createUserParams: CreateUserParams): Promise<string>{
    const { name, email, password } = createUserParams;

    const authCreated = await new Promise((resolve, reject) => {
      this.userPool.signUp(email, password,
        [new CognitoUserAttribute({ Name: 'name', Value: name})],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          }
          else {
            resolve(result);
          }
        });
    });

    return (authCreated as ISignUpResult).userSub;
  }

 // async confirmUser(confirmUserParams: ConfirmUserParams) {
 //   const client = new CognitoIdentityProviderClient();
 //   const input = {
 //     ClientId: process.env.AWS_COGNITO_USER_POOL_ID,
 //     Username: confirmUserParams.userName,
 //     ConfirmationCode: confirmUserParams.confirmationCode,
 //   };

 //   return client.send(input);
 // }
}
