import { ReasonPhrases, Router, StatusCodes } from "../../../deps/prod.ts";
import { eCat } from "./middleware.ts";
import { getUrl, URLMeta } from "./models.ts";
import { URLs } from "./utils.ts";

const router = Router();

router.get(URLs.INDEX, (_, res) => {
  res.render("index");
});

router.get(
  URLs.GET_SHORT_URL,
  eCat((req, res) => {
    const { short_url } = req.params;
    const urlMeta = getUrl(short_url);
    if (!urlMeta) {
      res.redirect(URLs.WILD);
    }
    res.send(urlMeta);
  }),
);

router.post(
  URLs.POST_SHORT_URL,
  eCat((req, res) => {
    console.log(req.body);
    const url: string = req.body;
    const urlMeta = new URLMeta(url);
    res.send(urlMeta);
  }),
);

router.get(URLs.WILD, (_, res) => {
  res.status = StatusCodes.NOT_FOUND;
  res.send(ReasonPhrases.NOT_FOUND);
});

export default router;