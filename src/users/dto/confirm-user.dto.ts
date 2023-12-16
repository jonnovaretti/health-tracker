import { IsEmail, IsNotEmpty } from "class-validator";

export class ConfirmUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;
}
