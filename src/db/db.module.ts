import { Module } from '@nestjs/common';
import { DbService } from './db.service';

@Module({
  providers: [DbService],
  exports: [DbService], // чтобы использовать по всему приложению
})
export class DbModule {}
