import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign<T>(payload: object | T | any) {
    return jwt.sign(payload, this.options.priveKey, { algorithm: 'RS256' });
  }
  verify(token: string) {
    // need to other algorithms case
    return jwt.verify(token, this.options.pubkey, {
      algorithms: ['RS256'],
    });
  }
}
