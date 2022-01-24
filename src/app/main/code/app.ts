import {
  cors,
  json,
  opine,
  ReasonPhrases,
  Router,
  StatusCodes,
  urlencoded,
} from "../../../deps/prod.ts";
import config from "./config.ts";
import { eCat, eHandler } from "./middleware.ts";
import { getUrl, URLMeta } from "./models.ts";
import { homePage } from "./ui.ts";
import { URLs } from "./utils.ts";
import { logger } from "./utils.ts";

const router = Router();

router.get(URLs.INDEX, (_, res) => {
  res.send(homePage());
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

const app = opine();
app.use(cors());
app.use(json());
app.use(urlencoded());
app.use(router);
app.use(eHandler);

export default app;

if (import.meta.main) {
  app.listen(config.PORT, () => {
    logger.info(`timestamp service running...`);
    config.display();
  });
}
