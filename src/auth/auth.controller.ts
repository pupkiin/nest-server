import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetSessionInfoDto, SignInBodyDto, SignUpBodyDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  // для регистрации
  // @Res({ passthrough: true }) res: Response - для cookie -> передается в куки сервис
  @Post('sign-up') // в скобках путь
  @ApiCreatedResponse() // передаем возвращаемое значение так как ts неявно не может его получить (тут ответ пуст)
  async signUp(
    @Body() body: SignUpBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(
      body.email,
      body.password,
      body.role,
    );

    // первый аргумент наш ответ, второй токен
    this.cookieService.setToken(res, accessToken);
  }

  // для входа
  @Post('sign-in') // в скобках путь
  @ApiOkResponse() // 200 статус
  @HttpCode(HttpStatus.OK) // возвращаем 200 -тый код
  async signIn(
    @Body() body: SignInBodyDto, // тело запроса
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(
      body.email,
      body.password,
    );

    // первый аргумент наш ответ, второй токен
    this.cookieService.setToken(res, accessToken);
  }

  // для выхода
  @Post('sign-out') // в скобках путь
  @ApiOkResponse() // 200 статус
  @UseGuards(AuthGuard) // не авторизованный пользователь не может вызвать этот метод
  @HttpCode(HttpStatus.OK) // возвращаем 200 -тый код
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
  }

  // получить сессию
  @Get('session')
  @ApiOkResponse({
    type: GetSessionInfoDto,
  }) // 200 статус
  @UseGuards(AuthGuard) // не авторизованный пользователь не может вызвать этот метод
  getSession(@SessionInfo() session: GetSessionInfoDto) {
    return session;
  }
}
