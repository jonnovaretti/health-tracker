import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { TokenValidatorService } from "../services/token-validator.service";

@Injectable()
export class AuthorizerGuard implements CanActivate {
  private COGNITO_WELL_KNOW_URL = process.env.AWS_COGNITO_WELL_KNOW_URL;

  constructor(private readonly tokenValidatorService: TokenValidatorService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); 
    const authorization = request.headers['authorization'];
    let authorizationString = '';

    if(Array.isArray(authorization)) {
      authorizationString = authorization[0];
    }
    else {
      authorizationString = authorization;
    }

    await this.tokenValidatorService.authorize(authorizationString, this.COGNITO_WELL_KNOW_URL); 

    return true;
  }  
}
