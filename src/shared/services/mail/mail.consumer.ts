import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { SendMailParams } from './interfaces/send-mail-params';
import { BaseMailService } from './mail.service';

@Processor('mail-send')
export class MailConsumer {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailService: BaseMailService) {}

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    this.logger.log(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name} for email ${job.data.email}: ${error.message}`,
      error.stack,
    );
  }

  @Process()
  sendMail(job: Job<SendMailParams>) {
    const { mailType, from, to, subject, text, html, attachments } = job.data;
    try {
      const result = this.mailService.deliveryMail({
        from,
        to,
        subject,
        text,
        html,
        attachments,
      });
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send ${mailType} email to ${to}.`,
        error.stack,
      );
      throw error;
    }
  }
}
