import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AccountDto, PatchAccountDto } from './dto';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';
import { Response } from 'express';

// будем брать id из сессии
@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  static tokenKey = 'access-token';

  // получить информацию об аккаунте
  @Get()
  @ApiOkResponse({
    type: AccountDto,
  })
  getAccount(@SessionInfo() session: GetSessionInfoDto): Promise<AccountDto> {
    return this.accountService.getAccount(session.id);
  }

  // изменение аккаунта
  @Patch()
  @ApiOkResponse({
    type: AccountDto,
  })
  patchAccount(
    @Body() body: PatchAccountDto,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<AccountDto> {
    return this.accountService.patchAccount(session.id, body);
  }

  // удалить пользователя и аккаунт, а также удаляем токен
  @Delete()
  @ApiOkResponse() // 200 статус
  @HttpCode(HttpStatus.OK) // возвращаем 200 -тый код
  deleteAccount(
    @SessionInfo() session: GetSessionInfoDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.accountService.deleteAccount(session.id);
    // тут удаляем токен
    res.clearCookie(AccountController.tokenKey);
  }
}
