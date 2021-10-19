import { Response } from 'express';
import { HttpErrorString } from '../../constants/http-error-string';
import { HttpErrorMessage } from '../models/http-error-message';
import {
  sendDataResponse,
  sendDataResponseWith404Option,
  sendDeleteResponse,
  sendEditResponse,
  sendErrorResponse,
} from './req-res.utils';

const mockRes = {
  status: jest.fn(),
  json: jest.fn(),
  sendStatus: jest.fn(),
};

mockRes.status.mockReturnValue(mockRes);
mockRes.json.mockReturnValue(mockRes);
mockRes.sendStatus.mockReturnValue(mockRes);

describe('sendDataResponse', () => {
  it('should respond with given status and data', () => {
    const sendFn = sendDataResponse(mockRes as unknown as Response, 204);
    const result = sendFn('hello world');

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.json).toHaveBeenCalledWith('hello world');
  });
});

describe('sendDataResponseWith404Option', () => {
  it('should respond with given status and data, if any', () => {
    const sendFn = sendDataResponseWith404Option(
      mockRes as unknown as Response,
      204,
    );
    const result = sendFn('hello world');

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.json).toHaveBeenCalledWith('hello world');
  });

  it('should respond with 404 error if no data is given', () => {
    const sendFn = sendDataResponseWith404Option(
      mockRes as unknown as Response,
      204,
    );
    const result = sendFn(null);

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: HttpErrorString.RESOURCE_NOT_FOUND,
    });
  });
});

describe('sendDeleteResponse', () => {
  it('should respond with 204 if delete count matches expectation', () => {
    const sendFn = sendDeleteResponse(mockRes as unknown as Response, 3);
    const result = sendFn(3);

    expect(result).toBe(mockRes);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(204);
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should respond with 404 if delete count is 0', () => {
    const sendFn = sendDeleteResponse(mockRes as unknown as Response, 3);
    const result = sendFn(0);

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: HttpErrorString.RESOURCE_NOT_FOUND,
    });
  });

  it('should respond with 400 if delete count is neither 0 nor expected value', () => {
    const sendFn = sendDeleteResponse(mockRes as unknown as Response, 3);
    const result = sendFn(2);

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: HttpErrorString.AMBIGIOUS_REQUEST,
    });
  });
});

describe('sendEditResponse', () => {
  it('should respond with 200 and update info if edit count matches expectation', () => {
    const sendFn = sendEditResponse(mockRes as unknown as Response, 3);
    const result = sendFn([3, ['a', 'b', 'c']]);

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(['a', 'b', 'c']);
  });

  it('should respond with 404 if edit count is 0', () => {
    const sendFn = sendEditResponse(mockRes as unknown as Response, 3);
    const result = sendFn([0, []]);

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: HttpErrorString.RESOURCE_NOT_FOUND,
    });
  });

  it('should respond with 400 if edit count is neither 0 nor expected value', () => {
    const sendFn = sendEditResponse(mockRes as unknown as Response, 3);
    const result = sendFn([2, ['a', 'b']]);

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: HttpErrorString.AMBIGIOUS_REQUEST,
    });
  });
});

describe('sendErrorResponse', () => {
  it('should send status and string containing name and message for plain errors', () => {
    const sendFn = sendErrorResponse(mockRes as unknown as Response, 409);
    const error = new Error('hurz');
    error.name = 'HurzError';
    const result = sendFn(error);

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'HurzError - hurz',
    });
  });

  it('shoud send status and string from given error message', () => {
    const sendFn = sendErrorResponse(mockRes as unknown as Response, 409);
    const error: HttpErrorMessage = {
      statusCode: 403,
      errorMessage: HttpErrorString.INVALID_CREDENTIALS,
    };
    const result = sendFn(error);

    expect(result).toBe(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(error.statusCode);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: error.errorMessage,
    });
  });
});
