import { AuthenticationTokenDto } from "../dto/authentication-token.dto";
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import { AuthenticationResult, CreateUserParams, ConfirmUserParams, LoginParams } from "../utils/types";

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

  async authenticate(loginParams: LoginParams): Promise<AuthenticationResult> {
    let authenticationToken: AuthenticationTokenDto;
    const userData = {
      Username: loginParams.email,
      Pool: this.userPool
    };

    const authenticationData = new AuthenticationDetails({
      Username: loginParams.email,
      Password: loginParams.password
    });

    const userCognito = new CognitoUser(userData);

    authenticationToken = await new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationData,
        {
          onSuccess: (result) => {
            resolve({
              accessToken: result.getAccessToken().getJwtToken(),
              refreshToken: result.getRefreshToken().getToken()
            });
          },
          onFailure: (err) => {
            reject(err);
          }
        });
    });

    return authenticationToken;
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
