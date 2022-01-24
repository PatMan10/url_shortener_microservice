import { StatusCodes } from "../../../deps/prod.ts";
import { Rhum, SuperDeno, superdeno } from "../../../deps/dev.ts";
import app from "../../main/code/app.ts";
import { ErrorMessages, URLs } from "../../main/code/utils.ts";
import { Timestamp } from "../../main/code/models.ts";

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

    Rhum.testSuite(`---------- GET ${URLs.GET_TIMESTAMP} ----------`, () => {
      const exec = async (date?: string) =>
        await superD.get(URLs.getTimestamp(date));

      Rhum.testCase("400 invalid date, return error\n", async () => {
        const res = await exec("asd");
        const { error } = res.body;

        assertEquals(res.status, StatusCodes.BAD_REQUEST);
        assertExists(error);
        assertEquals(error, ErrorMessages.INVALID_DATE);
      });

      Rhum.testCase("200 success, return timestamp\n", async () => {
        const res = await exec();
        const timestamp: Timestamp = res.body;

        assertEquals(res.status, StatusCodes.OK);
        assertExists(timestamp.unix);
        assertExists(timestamp.utc);
      });

      Rhum.testCase(
        "200 success, return timestamp based on parameter\n",
        async () => {
          const res = await exec("2015-12-25");
          const timestamp: Timestamp = res.body;

          assertEquals(res.status, StatusCodes.OK);
          assertEquals(timestamp.unix, 1451001600000);
          assertEquals(timestamp.utc, "Fri, 25 Dec 2015 00:00:00 GMT");
        },
      );
    });
  },
);

Rhum.run();
