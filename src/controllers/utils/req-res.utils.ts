import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import { HttpErrorString } from '../constants/http-error-string';
import { tokenSecret } from '../constants/token.constants';
import { HttpErrorMessage } from '../models/http-error-message';

/**
 * Helper method for controllers to send the result of an operation to the
 * client using the supplied status code (200 by default). Use this method
 * if the result of the operation is guaranteed to be defined.
 * @param res Response channel to use
 * @param successStatus HTTP status to send to the client, 200 by default
 * @returns A function that can be used as a callback handler, e. g. in a
 * Promise.then() call. The function will send the parameter value it receives
 * to the client via the response supplied in the res parameter.
 * @example
 * ```typescript
 * router.get('/', (req, res) => {
 *   service.executeDBQuery().then(sendDataResponse(res));
 * })
 * ```
 */
export const sendDataResponse = <E>(res: Response, successStatus = 200) => {
  return (data: E): Response => {
    return res.status(successStatus).send(data);
  };
};

/**
 * Helper method for controllers to send the result of an operation to the
 * client using the supplied status code (200 by default) or with status code
 * 404 if the result is empty. Use this method if the result of the operation
 * can be undefined or null and you want to send a 404 response in that case.
 * @param res Response channel to use
 * @param successStatus HTTP status to send to the client if the result is non-empty,
 * 200 by default
 * @returns A function that can be used as a callback handler, e. g. in a
 * Promise.then() call. The function will send the parameter value it receives
 * to the client via the response supplied in the res parameter or, if the parameter
 * value is empty, send a 404 response.
 * @example
 * ```typescript
 * router.get('/', (req, res) => {
 *   service.executeDBQuery().then(sendDataResponseWith404Option(res));
 * })
 * ```
 */
export const sendDataResponseWith404Option = <E>(
  res: Response,
  successStatus = 200,
) => {
  return (data: E | null): Response => {
    if (data) {
      return res.status(successStatus).send(data);
    }

    return res.status(404).send(HttpErrorString.RESOURCE_NOT_FOUND);
  };
};

/**
 * Helper method for controllers to map the delete count of a delete operation
 * to an HTTP response. Use this method if you expect the delete count of the operation
 * to be 1.
 * @param res Response channel to use
 * @returns A function that can be used as a callback handler, e. g. in a
 * Promise.then() call. The function will use the delete count it received to determine
 * the appropriate response status code. If the count is exactly 1, a 204 response will be sent.
 * If it is 0, a 404 response will be sent. In every other case, a 400 response container the error
 * string 'AMBIGUOUS_REQUEST' will be sent.
 * @example
 * ```typescript
 * router.get('/', (req, res) => {
 *   service.executeDBQuery().then(sendDeleteResponse(res));
 * })
 * ```
 */
export const sendDeleteResponse = (res: Response) => {
  return (deleteCount: number): Response => {
    if (deleteCount === 1) {
      return res.sendStatus(204);
    }

    if (deleteCount < 1) {
      return res.status(404).send({
        error: HttpErrorString.RESOURCE_NOT_FOUND,
      });
    }

    return res.status(400).send({
      error: HttpErrorString.AMBIGIOUS_REQUEST,
    });
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

/**
 * Helper method for controllers to send an error response to the client. Use this method
 * to obtain an error callback handler.
 * @param res Response channel to use
 * @param status HTTP status to send to the client, 500 by default
 * @returns A function that can be used as an error callback handler, e. g. for a Promise.then()
 * call. The function will send the error message of the error object it receives to the
 * client via the response supplied in the res parameter.
 * @example
 * ```typescript
 * router.get('/', (req, res) => {
 *   service.executeDBQuery().then(sendErrorResponse(res));
 * })
 * ```
 */
export const sendErrorResponse = (res: Response, status = 500) => {
  return (error: Error | HttpErrorMessage): Response => {
    console.log('Error querying:', error);

    let errorMessage;
    let errorStatus = status;

    if (isHttpErrorMessage(error)) {
      errorMessage = error.errorMessage;
      errorStatus = error.statusCode;
    } else {
      errorMessage = `${error.name} - ${error.message}` ?? error;
    }

    console.log('sending error message:', errorMessage);

    return res.status(errorStatus).send({ error: errorMessage });
  };
};

interface TokenMetaData {
  /**
   * Issued at timestamp
   */
  iat: number;
  /**
   * Expires at timestamp
   */
  exp: number;
}

export type TokenUserPartial = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName'
> &
  TokenMetaData;

/**
 * Returns the verified, decoded access token from the HTTP request, if one exists.
 * @param req The request containing the bearer token in the Authorization header
 * @returns The decoded token, which is verified against the token secret and safe
 * to use to identify the user making he request.
 */
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
        errorMessage: HttpErrorString.UNAUTHORIZED,
      } as HttpErrorMessage);
    }
  });
};
