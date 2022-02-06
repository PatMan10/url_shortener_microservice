import {
  cors,
  json,
  opine,
  renderFileToString,
  resolve,
  serveStatic,
  urlencoded,
} from "../../../deps/prod.ts";
import { eHandler } from "./middleware.ts";
import config from "./config.ts";
import controller from "./controller.ts";
import { logger } from "./utils.ts";

const app = opine();

// view engine setup
app.set("views", resolve("client/views"));
app.set("view engine", "ejs");
app.engine("ejs", renderFileToString);

// serve static assets
app.use(serveStatic(resolve("client/assets")));

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
