import { IsEmail, IsNotEmpty } from "class-validator";
import { Match } from "src/match.decorator";

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Match<CreateUserDto>('password')
  passwordConfirmation: string;
}
