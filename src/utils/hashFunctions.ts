import * as bcrypt from 'bcrypt';

export async function hash(rawString: string) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(rawString, salt);
}

export async function compareHashes(rawString: string, hashedString: string) {
  return await bcrypt.compare(rawString, hashedString);
}
