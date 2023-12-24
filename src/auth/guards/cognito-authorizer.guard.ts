import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { TokenValidatorService } from "../services/token-validator.service";

@Injectable()
export class AuthorizerGuard implements CanActivate {
  private COGNITO_WELL_KNOW_URL = process.env.AWS_COGNITO_WELL_KNOW_URL;

  constructor(private readonly tokenValidatorService: TokenValidatorService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest(); 
      const authorization = request.headers['authorization'];
      let authorizationString = '';

      if(Array.isArray(authorization)) {
        authorizationString = authorization[0];
      }
      else {
        authorizationString = authorization;
      }

      this.tokenValidatorService.checkUserRequest(authorizationString, request.params['userId']);
      await this.tokenValidatorService.authorize(authorizationString, this.COGNITO_WELL_KNOW_URL); 

      return true;
    }
    catch (e) {
      throw new UnauthorizedException();
   }
  }  
}
