import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
