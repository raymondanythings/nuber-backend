import { Secret } from 'jsonwebtoken';

export interface JwtModuleOptions {
  isRSA?: boolean;
  priveKey: Secret;
  pubkey?: Secret;
}
