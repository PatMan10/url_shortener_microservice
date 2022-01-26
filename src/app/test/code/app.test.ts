import { ReasonPhrases, StatusCodes } from "../../../deps/prod.ts";
import { Rhum, SuperDeno, superdeno } from "../../../deps/dev.ts";
import app from "../../main/code/app.ts";
import { ErrorMessages, URLs } from "../../main/code/utils.ts";
import { URLMeta } from "../../main/code/models.ts";

const { assertEquals, assertExists } = Rhum.asserts;

const title = "*-*-*-*-*-*-*-*-*-*- Timestamp Service *-*-*-*-*-*-*-*-*-*-";
Rhum.testPlan(
  title,
  () => {
    console.log(title);
    let superD: SuperDeno;

    Rhum.beforeAll(() => {
      superD = superdeno(app);
    });

    Rhum.afterAll(() => {
    });

    Rhum.testSuite(`---------- GET ${URLs.GET_SHORT_URL} ----------`, () => {
      const exec = async (shotUrl?: string) =>
        await superD.get(URLs.getShortUrl(shotUrl));

      Rhum.testCase("400 invalid short url, return error\n", async () => {
        const res = await exec("asd");
        const { error } = res.body;

        assertEquals(res.status, StatusCodes.BAD_REQUEST);
        assertEquals(error, ErrorMessages.INVALID_SHORT_URL);
      });

      Rhum.testCase("404 short url not found\n", async () => {
        const res = await exec("-1");
        const { error } = res.body;

        assertEquals(res.status, StatusCodes.NOT_FOUND);
        assertEquals(error, ReasonPhrases.NOT_FOUND);
      });

      Rhum.testCase("200 success, return url meta\n", async () => {
        const res = await exec("0");
        const urlMeta: URLMeta = res.body;

        assertEquals(res.status, StatusCodes.OK);
        assertEquals(urlMeta.short_url, 0);
        assertEquals(urlMeta.original_url, URLs.GITHUB_REPO);
      });
    });
  },
);

Rhum.run();
