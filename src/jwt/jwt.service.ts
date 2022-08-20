import { Inject, Injectable } from '@nestjs/common';

import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign<T>(payload: object | T | any) {
    return jwt.sign(payload, this.options.priveKey, {
      algorithm: this.options.isRSA ? 'RS256' : 'HS256',
    });
  }
  verify(token: string) {
    // need to other algorithms case
    return jwt.verify(
      token,
      this.options.isRSA ? this.options.pubkey : this.options.priveKey,
      {
        algorithms: [this.options.isRSA ? 'RS256' : 'HS256'],
      },
    );
  }
}
