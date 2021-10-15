import sirv from "sirv";
import polka from "polka";
import * as sapper from "@sapper/server";

polka() // You can also use Express
  .use(
    sirv("static", { dev: process.env.NODE_ENV === "development" }),
    sapper.middleware()
  )
  .listen(process.env.PORT, () => {});
