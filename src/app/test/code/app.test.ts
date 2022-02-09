import { ReasonPhrases, StatusCodes } from "../../../deps/prod.ts";
import { Rhum, superoak } from "../../../deps/dev.ts";
import app from "../../main/code/app.ts";
import { ErrorMessages, URLs } from "../../main/code/utils.ts";
import { URLMeta } from "../../main/code/models.ts";

const { assertEquals } = Rhum.asserts;

const title = "*-*-*-*-*-*-*-*-*-*- URL Shortener Service *-*-*-*-*-*-*-*-*-*-";
Rhum.testPlan(
  title,
  () => {
    console.log(title);

    Rhum.testSuite(`---------- GET ${URLs.GET_SHORT_URL} ----------`, () => {
      const exec = async (shotUrl?: string) =>
        (await superoak(app)).get(URLs.getShortUrl(shotUrl));

      Rhum.testCase("400 invalid short url, return error\n", async () => {
        const res = await exec("-1");
        const { error } = res.body;

        assertEquals(res.status, StatusCodes.BAD_REQUEST);
        assertEquals(error, ErrorMessages.INVALID_SHORT_URL);
      });

      Rhum.testCase("404 short url not found\n", async () => {
        const res = await exec("99");
        const { error } = res.body;

        assertEquals(res.status, StatusCodes.NOT_FOUND);
        assertEquals(error, ReasonPhrases.NOT_FOUND);
      });

      Rhum.testCase("200 success, redirect to original url\n", async () => {
        const res = await exec("0");
        assertEquals(res.status, StatusCodes.MOVED_TEMPORARILY);
      });
    });

    Rhum.testSuite(`---------- POST ${URLs.POST_SHORT_URL} ----------`, () => {
      const exec = async (url?: string) =>
        (await superoak(app)).post(URLs.POST_SHORT_URL).send({ url });

      Rhum.testCase("400 invalid short url, return error\n", async () => {
        const res = await exec("ftp:/john-doe.org");
        const { error } = res.body;

        //assertEquals(res.status, StatusCodes.BAD_REQUEST);
        assertEquals(error, ErrorMessages.INVALID_URL);
      });

      Rhum.testCase("201 success, return url meta\n", async () => {
        const postUrl = "https://duckduckgo.com";
        const res = await exec(postUrl);
        const urlMeta: URLMeta = res.body;

        assertEquals(res.status, StatusCodes.CREATED);
        assertEquals(urlMeta.short_url, 1);
        assertEquals(urlMeta.original_url, postUrl);
      });
    });
  },
);

Rhum.run();
