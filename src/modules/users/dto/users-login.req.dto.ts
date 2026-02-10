import { IsNotEmpty } from 'class-validator';

export class UsersLoginReqDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
