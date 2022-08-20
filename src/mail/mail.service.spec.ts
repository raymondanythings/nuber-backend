import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from 'src/mail/mail.service';
import * as Formdata from 'form-data';
import got from 'got';
jest.mock('got');
jest.mock('form-data');
const OPTIONS = {
  apiKey: 'test-apiKey',
  domain: 'test-domain',
  fromEmail: 'test-fromEmail',
};
describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: OPTIONS,
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerivicationEmail', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);
      service.sendVerivicationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'Verify Your Email',
        'akdfhr2@gmail.com',
        'confirm_alert',
        [
          { key: 'username', value: sendVerificationEmailArgs.email },
          { key: 'code', value: sendVerificationEmailArgs.code },
        ],
      );
    });
  });
  describe('sendEmail', () => {
    it('sends email', async () => {
      const result = await service.sendEmail('', '', '', [
        { key: 'one', value: '12' },
      ]);
      const formSpy = jest.spyOn(Formdata.prototype, 'append');
      expect(formSpy).toHaveBeenCalledTimes(5);
      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${OPTIONS.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${OPTIONS.apiKey}`,
            ).toString('base64')}`,
          },
          body: expect.any(Object),
        },
      );
      expect(result).toBe(true);
    });

    it('should fail on exception', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const result = await service.sendEmail('', '', '', [
        { key: 'one', value: '12' },
      ]);
      expect(result).toBe(false);
    });
  });
});
