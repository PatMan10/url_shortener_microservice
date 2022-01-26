import { ReasonPhrases, Router, StatusCodes } from "../../../deps/prod.ts";
import { eCat } from "./middleware.ts";
import { addUrl, exampleUrlMeta, getUrl, URLMeta } from "./models.ts";
import { ErrorMessages, URLs } from "./utils.ts";
import config from "./config.ts";

const router = Router();

router.get(URLs.INDEX, (_, res) => {
  const exampleShortUrl = config.BASE_URL.concat(
    URLs.getShortUrl(exampleUrlMeta.short_url.toString()),
  );
  const exampleLongUrl = exampleUrlMeta.original_url;
  res.render("index", { exampleShortUrl, exampleLongUrl });
});

router.get(
  URLs.GET_SHORT_URL,
  eCat((req, res) => {
    const { short_url } = req.params;
    // 400 invalid short url
    if (!/\d+/g.test(short_url)) {
      res.status = StatusCodes.BAD_REQUEST;
      res.send({ error: ErrorMessages.INVALID_SHORT_URL });
      return;
    }

    const urlMeta = getUrl(Number(short_url));
    // 404 short url not found
    if (!urlMeta) {
      res.status = StatusCodes.NOT_FOUND;
      res.send({ error: ReasonPhrases.NOT_FOUND });
      return;
    }

    // 200 success
    res.send(urlMeta);
    res.redirect(urlMeta.original_url);
  }),
);

router.post(
  URLs.POST_SHORT_URL,
  eCat((req, res) => {
    const { url } = req.parsedBody;
    // 400 invalid url
    if (!/^(ftp|http|https):\/\/[^ "]+$/.test(url)) {
      res.status = StatusCodes.BAD_REQUEST;
      res.send({ error: ErrorMessages.INVALID_URL });
      return;
    }
    const urlMeta = new URLMeta(url);
    addUrl(urlMeta);
    res.status = StatusCodes.CREATED;
    res.send(urlMeta);
  }),
);

router.get(URLs.WILD, (_, res) => {
  res.status = StatusCodes.NOT_FOUND;
  res.send(ReasonPhrases.NOT_FOUND);
});

export default router;
