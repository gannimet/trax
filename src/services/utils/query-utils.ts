import { v4 as uuidv4 } from 'uuid';
import { HttpErrorString } from '../../constants/http-error-string';
import { HttpErrorMessage } from '../../controllers/models/http-error-message';

const notFoundError: HttpErrorMessage = {
  statusCode: 404,
  errorMessage: HttpErrorString.RESOURCE_NOT_FOUND,
};

export const createUUID = (): string => {
  return uuidv4();
};

export const ensureQueryResult = <R>(
  queryPromise: Promise<R | null>,
  noResultError: HttpErrorMessage = notFoundError,
): Promise<R> => {
  return queryPromise.then(
    (queryResult) => {
      if (queryResult) {
        return Promise.resolve(queryResult);
      }

      return Promise.reject(noResultError);
    },
    (queryError) => Promise.reject(queryError),
  );
};

export const ensureUserPermissionByQuery = <R>(
  queryPromise: Promise<R | null>,
): Promise<R> => {
  return ensureQueryResult(queryPromise, {
    statusCode: 403,
    errorMessage: HttpErrorString.MISSING_RIGHTS,
  });
};

export const ensureNonEmptyListQueryResult = <R>(
  queryPromise: Promise<R[]>,
  noResultError: HttpErrorMessage = notFoundError,
): Promise<R[]> => {
  return queryPromise.then(
    (queryResult) => {
      if (queryResult && queryResult.length > 0) {
        return Promise.resolve(queryResult);
      }

      return Promise.reject(noResultError);
    },
    (queryError) => Promise.reject(queryError),
  );
};
