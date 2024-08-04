import { Global, Module } from '@nestjs/common';

import { BaseMailService } from './services/mail/mail.service';

const providers = [BaseMailService];

@Global()
@Module({
  providers: [...providers],
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
