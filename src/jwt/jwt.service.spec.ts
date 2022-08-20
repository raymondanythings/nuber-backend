import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from 'src/jwt/jwt.service';
import * as jwt from 'jsonwebtoken';

const PAYLOAD = {
  id: 1,
};
const TEST_KEY = '123';
const PUB_KEY = '123';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'TOKEN'),
    verify: jest.fn(() => PAYLOAD),
  };
});

describe('JwtService', () => {
  let service: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            priveKey: TEST_KEY,
          },
        },
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should return a signed token', async () => {
      const token = service.sign(PAYLOAD);
      expect(typeof token).toBe('string');
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(PAYLOAD, TEST_KEY, {
        algorithm: 'HS256',
      });
    });
  });
  describe('verify', () => {
    it('should return the decoded token', async () => {
      const TOKEN = 'TOKEN';
      const decodedToken = service.verify(TOKEN);
      expect(decodedToken).toEqual(PAYLOAD);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY, {
        algorithms: ['HS256'],
      });
    });
  });
});
describe('JwtService with RSA', () => {
  let service: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            priveKey: TEST_KEY,
            isRSA: true,
            pubkey: PUB_KEY,
          },
        },
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should return a signed token', async () => {
      const token = service.sign(PAYLOAD);
      expect(typeof token).toBe('string');
      expect(jwt.sign).toHaveBeenCalledWith(PAYLOAD, TEST_KEY, {
        algorithm: 'RS256',
      });
    });
  });
  describe('verify', () => {
    it('should return the decoded token', async () => {
      const TOKEN = 'TOKEN';
      const decodedToken = service.verify(TOKEN);
      expect(decodedToken).toEqual(PAYLOAD);
      expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY, {
        algorithms: ['RS256'],
      });
    });
  });
});
