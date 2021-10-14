import { Request, Response } from 'express';

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

export const sendErrorResponse = (res: Response, status = 500) => {
  return (err: Error): Response => {
    console.log('Error querying:', err);

    return res.sendStatus(status);
  };
};
