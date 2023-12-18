import axios from 'axios';
import * as jwtToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt'; 
import { UnauthorizedException } from '@nestjs/common';

export class TokenValidatorService {
  async authorize(authenticationHeader: string, authServerUrl: string) {
    if (!authenticationHeader) {
      throw new UnauthorizedException(`Authorization header is required`);
    }

    const tokenArray = authenticationHeader.split(' ', 2);
    
    if (!tokenArray[0] || tokenArray[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Token type must be Bearer');
    }

    try {
      await this.validateAccessToken(tokenArray[1], authServerUrl);
    } catch (e) {
      throw new UnauthorizedException(e.message)
    }
  }

  async validateAccessToken(token: string, authServerUrl: string) {
    return new Promise((resolve, reject) => {
      axios.get(authServerUrl, { headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          const body = response.data;
          let pems = {};
          const keys = body['keys'];
          
          const jw = new JwtService();
          const decodeJw = jw.decode(token, {complete: true});
          if (!decodeJw) reject(new Error('Token is invalid'));

          keys.forEach(key => {
            const keyId = key.kid;
            const modulus = key.n;
            const exponent = key.e;
            const keyType = key.kty;
            const jwk = { kty: keyType, n: modulus, e: exponent };
            const pem = jwtToPem(jwk);
            pems[keyId] = pem;
          });

          const kid = decodeJw['header'].kid;
          const pem = pems[kid];

          if (!pem) reject(new Error('Token is invalid'));

          jw.verify(token, { publicKey: pem });
          resolve(pem);
        });
    });
  }
}
