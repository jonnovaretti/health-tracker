import { IsNotEmpty } from "class-validator";

export class CreateBloodTestDto {
  @IsNotEmpty()
  filename: string;
}
