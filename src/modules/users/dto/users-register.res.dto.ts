import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsersRegisterResDto {
  @IsNotEmpty()
  name: string;

  @IsString()
  address: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
