import {
  cors,
  dirname,
  join,
  json,
  opine,
  renderFileToString,
  serveStatic,
  urlencoded,
} from "../../../deps/prod.ts";
import { eHandler } from "./middleware.ts";
import config, { Env } from "./config.ts";
import controller from "./controller.ts";
import { logger } from "./utils.ts";

const _dirname = dirname(import.meta.url).substring(
  config.ENV === Env.PROD ? 4 : 0,
);
const app = opine();

// view engine setup
app.set("views", join(_dirname, "ui/views"));
app.set("view engine", "ejs");
app.engine("ejs", renderFileToString);

// serve static assets
app.use(serveStatic(join(_dirname, "ui/assets")));

// handle different types of post data
app.use(json());
app.use(urlencoded());

app.use(cors());
app.use(controller);
app.use(eHandler);

export default app;

if (import.meta.main) {
  app.listen(config.PORT, () => {
    logger.info(`timestamp service running...`);
    config.display();
  });
}
