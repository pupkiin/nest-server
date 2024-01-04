import { Injectable } from '@nestjs/common';
import { PatchAccountDto } from './dto';
import { DbService } from 'src/db/db.service';
import { Role } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private db: DbService) {}

  // создать аккаунт
  async createAccount(userId: number, userRole: Role) {
    return this.db.account.create({
      data: {
        userId: userId,
        role: userRole,
      },
    });
  }

  // получить данные аккаунта
  async getAccount(userId: number) {
    return this.db.account.findUniqueOrThrow({ where: { userId: userId } });
  }

  // todo ! patch dto
  // изменить аккаунт
  async patchAccount(userId: number, patch: PatchAccountDto) {
    return this.db.account.update({
      where: { userId: userId },
      data: { ...patch },
    });
  }

  // удалить аккаунт
  async deleteAccount(userId: number) {
    await this.db.account.delete({ where: { userId: userId } });
    await this.db.user.delete({ where: { id: userId } });
  }
}
