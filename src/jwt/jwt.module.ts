import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';
import * as path from 'path';
import * as fs from 'fs';
import { Secret } from 'jsonwebtoken';
@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    const { priveKey, isRSA } = options;
    let key: Secret;
    let pubkey: Secret;
    if (!isRSA) {
      key = priveKey;
    } else {
      const pemkey = fs.readFileSync(
        path.resolve(__dirname, '../../pem/jwtRS256.key'),
      );
      key = pemkey;
      pubkey = fs.readFileSync(
        path.resolve(__dirname, '../../pem/jwtRS256.key.pub'),
      );
    }
    return {
      module: JwtModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: { ...options, priveKey: key, pubkey },
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
