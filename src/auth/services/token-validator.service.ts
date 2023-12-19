import axios from 'axios';
import { JwtService } from '@nestjs/jwt'; 
import { UnauthorizedException } from '@nestjs/common';

export class TokenValidatorService {
  async authorize(authenticationHeader: string, authServerUrl: string) {
    if (!authenticationHeader) {
      throw new UnauthorizedException(`Authorization header is required`);
    }

    const token = this.extractToken(authenticationHeader);

    try {
      await this.validateAccessToken(token, authServerUrl);
    } 
    catch (e) {
      throw new UnauthorizedException(e.message)
    }
  }

  checkUserRequest(authenticationHeader: string, userId: string) {
    const token = this.extractToken(authenticationHeader);
    const jwtDecoded = this.extractJwt(token);
    const sub = jwtDecoded['payload'].sub;

    console.log(userId);
    console.log(sub);
    if(userId != sub) throw new UnauthorizedException('User is not authorized');
  }

  private async validateAccessToken(token: string, authServerUrl: string) {
    const jwtService = new JwtService();
    const jwtDecoded = this.extractJwt(token);

    return new Promise((resolve, reject) => {
      axios.get(authServerUrl, { headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          const body = response.data;

          const pem = this.buildPem(body['keys'], jwtDecoded['header'].kid);
          if (!pem) {
            reject(new Error('Token is invalid'));
            return;
          }

          jwtService.verify(token, { publicKey: pem });
          resolve(pem);
        });
    });
  }

  private extractJwt(token: string) {
    const jwtService = new JwtService();
    const jwtDecoded = jwtService.decode(token, {complete: true});

    if(!jwtDecoded) throw new UnauthorizedException('Token format is invalid');

    return jwtDecoded;
  }

  private buildPem(keys: any, kid: string): any {
    const jwtToPem = require('jwk-to-pem');
    let pems = {};

    keys.forEach(key => {
      const keyId = key.kid;
      const modulus = key.n;
      const exponent = key.e;
      const keyType = key.kty;
      const jwk = { kty: keyType, n: modulus, e: exponent };
      const pem = jwtToPem(jwk);
      pems[keyId] = pem;
    });

    return pems[kid];
  }

  private extractToken(authenticationHeader) {
    const tokenArray = authenticationHeader.split(' ', 2);
    
    if (!tokenArray[0] || tokenArray[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Token type must be Bearer');
    }

    return tokenArray[1];
  }
}
