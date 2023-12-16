import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import { CreateUserParams, ConfirmUserParams } from "../utils/types";

export class AuthUsersService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser(createUserParams: CreateUserParams): Promise<string>{
    let externalUserId: string;
    const { name, email, password } = createUserParams;

    await new Promise((resolve, reject) => {
      this.userPool.signUp(email, password,
        [new CognitoUserAttribute({ Name: 'name', Value: name})],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          }
          else {
            externalUserId = result.userSub;
            resolve(result);
          }
        });
    });

    return externalUserId; 
  }

  async confirmUser(confirmUserParams: ConfirmUserParams) {
    const userData = {
      Username: confirmUserParams.email,
      Pool: this.userPool
    };

    const cognitoUser = new CognitoUser(userData);

    await new Promise((resolve, reject) => { 
      cognitoUser.confirmRegistration(confirmUserParams.code, true,
        (err, result) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(result);
          }
        });
    });
  }
}
