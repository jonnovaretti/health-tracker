export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
}

export type CreateBloodTestParams = {
  filename: string;
}

export type ConfirmUserParams = {
  email: string;
  code: string;
}
