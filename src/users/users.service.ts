import { CreateAccountInput } from './dtos/create-account.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginInput, LoginOutput } from './dtos/login.dto';

import * as bcrypt from 'bcrypt';
import { MutationOutput } from 'src/common/dtos/output.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<MutationOutput> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already.' };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const loginUser = await this.users.findOne({ where: { email } });
      if (!loginUser) {
        return { ok: false, error: "User doesn't exist" };
      }
      const passwordCorrect = loginUser.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: "Password doesn't correct" };
      }
      return { ok: true, token: '12312' };
    } catch (error) {
      console.log(error);
      return { ok: false, error };
    }
  }
}