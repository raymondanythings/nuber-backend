import { CreateAccountInput } from './dtos/create-account.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CoreOutput> {
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

      const token = this.jwtService.sign({ id: loginUser.id });

      return { ok: true, token };
    } catch (error) {
      console.log(error);
      return { ok: false, error };
    }
  }

  async findById(id: number) {
    return this.users.findOne({ where: { id } });
  }

  async editProfile(userId: number, { email, password }: EditProfileInput) {
    return this.users.update(userId, { email, password });
  }
}
