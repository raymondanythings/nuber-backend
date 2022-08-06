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
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
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
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(this.verifications.create({ user }));
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const loginUser = await this.users.findOne({
        where: { email },
        select: ['id', 'password'],
      });
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

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }

  async VerifyEmail(code: string): Promise<boolean> {
    try {
      const verifications = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verifications) {
        verifications.user.verified = true;
        this.users.save(verifications.user);
        return true;
      }
      throw new Error();
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
