import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

import { SendMailParams } from './interfaces/send-mail-params';

@Injectable()
export class BaseMailService {
  private readonly logger = new Logger(BaseMailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    sgMail.setApiKey(apiKey);
  }

  public deliveryMail({ to, subject, text, html }: SendMailParams) {
    const from = this.configService.get('EMAIL_FROM');
    const msg = {
      to,
      from,
      subject,
      text,
      html: `<strong>${html}</strong>`,
    };

    sgMail
      .send(msg)
      .then((response) => {
        this.logger.log(
          `Mail sent from ${from} to ${to}: ${response[0].statusCode}`,
        );
      })
      .catch((error) => {
        this.logger.error(`Fail to send mail from ${from} to ${to}: ${error}`);
      });
  }
}
