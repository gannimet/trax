import { HttpErrorString } from '../../constants/http-error-string';
import { HttpErrorMessage } from '../../controllers/models/http-error-message';

const badRequestError: HttpErrorMessage = {
  statusCode: 404,
  errorMessage: HttpErrorString.RESOURCE_NOT_FOUND,
};

export const ensureQueryResult = <R>(
  queryPromise: Promise<R | null>,
  noResultError: HttpErrorMessage = badRequestError,
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
