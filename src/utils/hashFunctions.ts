import * as bcrypt from 'bcrypt';

export async function hash(rawString: string) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(rawString, salt);
}
