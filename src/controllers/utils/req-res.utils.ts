import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpErrorString } from '../../constants/http-error-string';
import { accessTokenSecret } from '../../constants/token.constants';
import User from '../../models/sequelize/user';
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
    return res.status(successStatus).json(data);
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
      return res.status(successStatus).json(data);
    }

    return res.status(404).json({ error: HttpErrorString.RESOURCE_NOT_FOUND });
  };
};

/**
 * Helper method for controllers to map the delete count of a delete operation
 * to an HTTP response. Use this method if your operation returns the delete count.
 * @param res Response channel to use
 * @param expectedCount The number of entries you expect to be deleted by the operation
 * (1 by default)
 * @returns A function that can be used as a callback handler, e. g. in a
 * Promise.then() call. The function will use the delete count it received to determine
 * the appropriate response status code. If the count is equal to expectedCount, a 204
 * response will be sent. If it is 0, a 404 response will be sent. In every other case,
 * a 400 response containing the error string 'AMBIGUOUS_REQUEST' will be sent.
 * @example
 * ```typescript
 * router.get('/', (req, res) => {
 *   service.executeDBQuery().then(sendDeleteResponse(res));
 * })
 * ```
 */
export const sendDeleteResponse = (res: Response, expectedCount = 1) => {
  return (deleteCount: number): Response => {
    if (deleteCount === expectedCount) {
      return res.sendStatus(204);
    }

    if (deleteCount === 0) {
      return res.status(404).json({
        error: HttpErrorString.RESOURCE_NOT_FOUND,
      });
    }

    return res.status(400).json({
      error: HttpErrorString.AMBIGIOUS_REQUEST,
    });
  };
};

/**
 * Helper method for controllers to map the number of updated entries of an update
 * operation to an HTTP response. Use this method if your operation returns an array
 * containing the update count and optionally the list of updated entities, in that order
 * and you know exactly how many entries your operation is supposed to affect.
 * @param res Response channel to use
 * @param expectedCount The number of entries you expect to be updated by the operation
 * @returns A function that can be used as a callback handler, e. g. in a
 * Promise.then() call. The function will use the update count it received to determine
 * the appropriate response status code. If the count is equal to expectedCount, a 200
 * response will be sent. If it is 0, a 404 response will
 * be sent. In every other case, a 400 response containing the error string
 * 'AMBIGUOUS_REQUEST' will be sent.
 *
 * Note: In case a 200 response is sent, it will only contain the affected entities
 * for postgres and mssql databases with `options.returning` true. See sequelize docs.
 * @example
 * ```typescript
 * router.get('/', (req, res) => {
 *   service.executeDBQuery().then(sendEditResponse(res));
 * })
 * ```
 */
export const sendEditResponse = <E>(res: Response, expectedCount: number) => {
  return ([updateCount, updatedEntities]: [number, E[]]): Response => {
    if (updateCount === expectedCount) {
      return res.status(200).json(updatedEntities);
    }

    if (updateCount === 0) {
      return res.status(404).json({
        error: HttpErrorString.RESOURCE_NOT_FOUND,
      });
    }

    return res.status(400).json({
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
 *   service.executeDBQuery().then(() => {}, sendErrorResponse(res));
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
      errorMessage = `${error.name} - ${error.message}`;
    }

    return res.status(errorStatus).json({ error: errorMessage });
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
 * @returns A promise resolving with the decoded token, which is verified against
 * the token secret and safe to use to identify the user making he request. If the
 * token could not be verified, the promise will be rejected with a 403 HTTP error.
 * If no token was found in the request header, the promise will be rejected with a
 * 401 HTTP error.
 */
export const getVerifiedUserToken = (
  req: Request,
): Promise<TokenUserPartial> => {
  const authHeader = req.headers.authorization;

  return new Promise((resolve, reject) => {
    if (authHeader) {
      const token = authHeader.split(' ')?.[1];

      if (!token) {
        return reject({
          statusCode: 403,
          errorMessage: HttpErrorString.INVALID_CREDENTIALS,
        } as HttpErrorMessage);
      }

      jwt.verify(token, accessTokenSecret, (err, user) => {
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
