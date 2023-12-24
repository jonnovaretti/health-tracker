import { IsEmail, IsNotEmpty, Matches } from "class-validator";
import { Match } from "../../utils/match.decorator";

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  ) password: string;

  @IsNotEmpty()
  @Match<CreateUserDto>('password')
  passwordConfirmation: string;
}
