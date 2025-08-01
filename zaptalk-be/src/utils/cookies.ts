import { Response } from 'express';
import { StringValue } from 'ms';
import * as ms from 'ms';

export function setAuthCookie(res: Response, refresh_token: string) {
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ms(process.env.COOKIE_MAX_AGE as StringValue),
  });
}
