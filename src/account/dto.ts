import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class AccountDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  role: Role;
}

export class PatchAccountDto {
  @ApiProperty()
  @IsOptional()
  role: Role;
}
