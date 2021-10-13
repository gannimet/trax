import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { tokenSecret } from '../constants';

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')?.[1];

    jwt.verify(token, tokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      next();
    });
  } else {
    res.sendStatus(401);
  }
};
