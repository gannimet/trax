import { NextFunction, Request, Response } from 'express';
import { HttpErrorMessage } from '../controllers/models/http-error-message';
import { getVerifiedUserToken } from '../controllers/utils/req-res.utils';

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  getVerifiedUserToken(req).then(
    (user) => {
      console.log('User making request:', user);
      next();
    },
    (err: HttpErrorMessage) => {
      res.sendStatus(err.statusCode);
    },
  );
};
