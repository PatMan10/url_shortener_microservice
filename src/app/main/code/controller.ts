import { ReasonPhrases, Router, StatusCodes } from "../../../deps/prod.ts";
import { eCat } from "./middleware.ts";
import { addUrl, exampleUrlMeta, getUrl, URLMeta } from "./models.ts";
import { URLs } from "./utils.ts";
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
    const urlMeta = getUrl(Number(short_url));
    if (!urlMeta) {
      res.redirect(URLs.WILD);
    } else {
      res.redirect(urlMeta.original_url);
    }
  }),
);

router.post(
  URLs.POST_SHORT_URL,
  eCat((req, res) => {
    const { url } = req.parsedBody;
    const urlMeta = new URLMeta(url);
    addUrl(urlMeta);
    res.send(urlMeta);
  }),
);

router.get(URLs.WILD, (_, res) => {
  res.status = StatusCodes.NOT_FOUND;
  res.send(ReasonPhrases.NOT_FOUND);
});

export default router;
