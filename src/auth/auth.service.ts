import { PasswordService } from './password.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private paswordService: PasswordService,
    private jwtService: JwtService,
  ) {}
  // регистрация
  async signUp(email: string, password: string, role: Role) {
    const user = await this.usersService.findUserByEmail(email);

    if (user) {
      throw new BadRequestException({ type: 'email-exists' });
    }
    // создаем соль и хеш
    const salt = this.paswordService.getSalt();
    const hash = this.paswordService.getHash(password, salt);
    // создаем нового юзера в бд
    const newUser = await this.usersService.createUser(email, role, hash, salt);
    // создаем токен из id и email
    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      email: newUser.email,
    });

    return { accessToken };
  }

  // вход
  async signIn(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    // генерируем hash
    const hash = this.paswordService.getHash(password, user.salt);
    // проверяем хэши, если не совпадают -> пользователь не авторизован
    if (hash !== user.hash) {
      throw new UnauthorizedException();
    }
    // создаем токен из id и email
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
