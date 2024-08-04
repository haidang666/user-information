import { Module } from '@nestjs/common';
import { ReqResService } from './reqres.service';

@Module({
  providers: [ReqResService],
  exports: [ReqResService],
})
export class ReqResModule {}
