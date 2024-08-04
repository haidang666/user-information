import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './user.entity';
import { ReqResModule } from '../reqres/reqres.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ReqResModule,
    CacheModule.register(),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
