import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  hashPassword: string,
  password: string,
) => {
  await bcrypt.compare(password, hashPassword);
};
