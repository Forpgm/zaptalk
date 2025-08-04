import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashPassword);
};
