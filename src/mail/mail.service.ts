import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVars, MailModuleOptions } from './mail.interface';
import got from 'got';
import * as FormData from 'form-data';
@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}
  async sendEmail(
    subject: string,
    to: string,
    templateName: string,
    emailVars: EmailVars[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append('from', `Nuber Eats <support@nubereats.com>`);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', templateName);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));
    try {
      const response = await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerivicationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'akdfhr2@gmail.com', 'confirm_alert', [
      { key: 'username', value: email },
      { key: 'code', value: code },
    ]);
  }
}
