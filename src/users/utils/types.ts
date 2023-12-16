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

export type LoginParams = {
  email: string;
  password: string;
}

export type AuthenticationResult = {
  accessToken: string;
  refreshToken: string;
}
