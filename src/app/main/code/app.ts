import { cors, json, opine, urlencoded } from "../../../deps/prod.ts";
import { eHandler } from "./middleware.ts";
import config from "./config.ts";
import controller from "./controller.ts";
import { logger } from "./utils.ts";

const app = opine();

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
