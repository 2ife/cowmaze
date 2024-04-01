import express, { ErrorRequestHandler } from "express";
import morgan from "morgan";
import path from "path";
import nunjucks from "nunjucks";
import dotenv from "dotenv";

import router from "./router";
import { sequelize, User } from "./models";
import { logger } from "./logger";
import helmet from "helmet";
import hpp from "hpp";

dotenv.config();
const app = express();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err: any) => {
    console.error(err);
  });

if (process.env.NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
  app.use(hpp());
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}
app.use(express.static(path.join(__dirname, "public"), { maxAge: 2592000000 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

const firstErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  try {
    const { place, content, user } = err;
    logger.error(`loginId: ${user} / place: ${place} / content: ${content}`);
    if (user) {
      const targetUser = await User.findOne({ where: { loginId: user } });
      if (targetUser) {
        targetUser.loginCode = null;
        await targetUser.save();
      }
    }
    res.json({ answer: "error" });
  } catch (err: any) {
    logger.error(err.message);
    res.json({ answer: "error" });
  }
};

const lastErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  try {
    res.json({ answer: "error" });
  } catch (err: any) {
    logger.error(err.message);
    res.json({ answer: "error" });
  }
};

app.use(firstErrorHandler);
app.use((req, res, next) => {
  const error = new Error(`no router: ${req.method} ${req.url}`);
  next(error);
});
app.use(lastErrorHandler);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
