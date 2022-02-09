import { ReasonPhrases, Router, StatusCodes } from "../../../deps/prod.ts";
import { addUrl, exampleUrlMeta, getUrl, URLMeta } from "./models.ts";
import { ErrorMessages, URLs, validLongURL, validShortURL } from "./utils.ts";
import config from "./config.ts";
import { IndexPage } from "./ui.ts";

const controller = new Router();

controller.get(URLs.INDEX, (ctx) => {
  const exampleShortUrl = config.BASE_URL +
    URLs.getShortUrl(String(exampleUrlMeta.short_url));
  const exampleLongUrl = exampleUrlMeta.original_url;

  ctx.response.headers.set("content-type", "text/html");
  ctx.response.body = IndexPage({
    exampleShortUrl,
    exampleLongUrl,
  });
});

controller.get(
  URLs.GET_SHORT_URL,
  (ctx) => {
    const { short_url } = ctx.params;
    // 400 invalid short url
    if (!validShortURL.test(short_url)) {
      ctx.response.status = StatusCodes.BAD_REQUEST.valueOf();
      ctx.response.body = { error: ErrorMessages.INVALID_SHORT_URL };
      return;
    }

    const urlMeta = getUrl(Number(short_url));
    // 404 short url not found
    if (!urlMeta) {
      ctx.response.status = StatusCodes.NOT_FOUND.valueOf();
      ctx.response.body = { error: ReasonPhrases.NOT_FOUND };
      return;
    }

    // 200 success
    ctx.response.redirect(urlMeta.original_url);
  },
);

controller.post(
  URLs.POST_SHORT_URL,
  async (ctx) => {
    const contentType = ctx.request.headers.get("content-type");
    const body = await ctx.request.body().value;
    const url = (contentType === "application/x-www-form-urlencoded")
      ? (body as URLSearchParams).get("url") as string
      : body.url;

    // 400 invalid url
    if (!validLongURL.test(url)) {
      //ctx.response.status = StatusCodes.BAD_REQUEST.valueOf();
      ctx.response.body = { error: ErrorMessages.INVALID_URL };
      return;
    }

    // 201 success
    const urlMeta = new URLMeta(url);
    addUrl(urlMeta);
    ctx.response.status = StatusCodes.CREATED.valueOf();
    ctx.response.body = urlMeta;
  },
);

export default controller;
