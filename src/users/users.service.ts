import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AccountService } from 'src/account/account.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(
    private db: DbService,
    private accountService: AccountService,
  ) {}

  // найти пользователя
  findUserByEmail(email: string) {
    return this.db.user.findFirst({ where: { email } });
  }

  // создать пользователя
  async createUser(email: string, role: Role, hash: string, salt: string) {
    const user = await this.db.user.create({ data: { email, hash, salt } });
    // сразу создаем аккаунт пользователя
    await this.accountService.createAccount(user.id, role);

    return user;
  }
}
