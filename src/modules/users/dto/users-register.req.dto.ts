import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class UsersRegisterReqDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must contain at least one letter, one number and one special character',
  })
  password: string;

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must contain at least one letter, one number and one special character',
  })
  confirmPassword: string;
}
