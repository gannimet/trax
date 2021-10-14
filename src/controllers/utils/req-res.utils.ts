import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import { HttpErrorString } from '../constants/http-error-string';
import { tokenSecret } from '../constants/token.constants';
import { HttpErrorMessage } from '../models/http-error-message';

export type ControllerMethod = (req: Request, res: Response) => void;

export const sendDataResponse = <E>(res: Response, successStatus = 200) => {
  return (data: E): Response => {
    return res.status(successStatus).send(data);
  };
};

export const sendDataResponseWith404Option = <E>(
  res: Response,
  successStatus = 200,
) => {
  return (data: E | null): Response => {
    if (data) {
      return res.status(successStatus).send(data);
    }

    return res.sendStatus(404);
  };
};

const isHttpErrorMessage = (
  value: Error | HttpErrorMessage,
): value is HttpErrorMessage => {
  return (
    // eslint-disable-next-line no-prototype-builtins
    value.hasOwnProperty('statusCode') && value.hasOwnProperty('errorMessage')
  );
};

export const sendErrorResponse = (res: Response, status = 500) => {
  return (error: Error | HttpErrorMessage): Response => {
    console.log('Error querying:', error);

    let errorMessage;
    let errorStatus = status;

    if (isHttpErrorMessage(error)) {
      errorMessage = error.errorMessage;
      errorStatus = error.statusCode;
    } else {
      errorMessage = error;
    }

    console.log('sending error message:', errorMessage);

    return res.status(errorStatus).send({ error: errorMessage });
  };
};

interface TokenMetaData {
  iat: number;
  exp: number;
}

export type TokenUserPartial = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName'
> &
  TokenMetaData;

export const getVerifiedUserToken = (
  req: Request,
): Promise<TokenUserPartial> => {
  const authHeader = req.headers.authorization;

  return new Promise((resolve, reject) => {
    if (authHeader) {
      const token = authHeader.split(' ')?.[1];

      jwt.verify(token, tokenSecret, (err, user) => {
        if (err) {
          return reject({
            statusCode: 403,
            errorMessage: HttpErrorString.INVALID_CREDENTIALS,
          } as HttpErrorMessage);
        }

        return resolve(user as TokenUserPartial);
      });
    } else {
      return reject({
        statusCode: 401,
        errorMessage: HttpErrorString.MISSING_AUTHORIZATION,
      } as HttpErrorMessage);
    }
  });
};
