import { Context, ReasonPhrases, StatusCodes } from "../../../deps/prod.ts";
import { ErrorMessages, logger } from "./utils.ts";

type MiddlewareContext = Context<Record<string, any>, Record<string, any>>;
type NextFun = () => Promise<unknown>;

export async function reqLogger(
  ctx: MiddlewareContext,
  next: NextFun,
) {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  logger.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
}

export async function reqTimer(
  ctx: MiddlewareContext,
  next: NextFun,
) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
}

export async function errorHandler(
  ctx: MiddlewareContext,
  next: NextFun,
) {
  try {
    await next();
  } catch (err) {
    logger.error(err.message, err);
    ctx.response.status = StatusCodes.INTERNAL_SERVER_ERROR.valueOf();
    ctx.response.body = { error: ErrorMessages.INTERNAL_SERVER_ERROR };
  }
}

export function notFound(
  ctx: MiddlewareContext,
) {
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = StatusCodes.NOT_FOUND.valueOf();
  ctx.response.body = ReasonPhrases.NOT_FOUND;
}
