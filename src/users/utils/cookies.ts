function addCookie(res: any, name: string, value: string, expiresAt: Date) {
  res.cookie(name, value, {
    expires: expiresAt,
    sameSite: 'strict',
    httpOnly: true,
  });
}

export function addAccessTokenToCookies(res: any, accessToken: string) {
  const expiresAt = new Date(new Date().getTime() + 30 * 1000);
  addCookie(res, 'accessToken', accessToken, expiresAt);
}

export function addRefreshTokenToCookies(res: any, refreshToken: string) {
  const expiresAt = new Date(new Date().getTime() + 30 * 10000);
  addCookie(res, 'refreshToken', refreshToken, expiresAt);
}
