import {
  NextFunction,
  OpineRequest,
  OpineResponse,
  StatusCodes,
} from "../../../deps/prod.ts";
import { ErrorMessages, logger } from "./utils.ts";

type MiddlewareFun = (
  req: OpineRequest,
  res: OpineResponse,
  next?: NextFunction,
) => void;

export const eCat = (handler: MiddlewareFun) =>
  (req: OpineRequest, res: OpineResponse, next: NextFunction) => {
    try {
      handler(req, res);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

export const eHandler = (
  error: Error,
  _req: OpineRequest,
  res: OpineResponse,
  _next: NextFunction,
) => {
  logger.error(error);
  if (error.message === ErrorMessages.INVALID_URL) {
    res.status = StatusCodes.BAD_REQUEST;
    res.send({ error: error.message });
  } else {
    res.status = StatusCodes.INTERNAL_SERVER_ERROR;
    res.send({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};
