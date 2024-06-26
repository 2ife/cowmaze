"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./router"));
const models_1 = require("./models");
const logger_1 = require("./logger");
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");
nunjucks_1.default.configure("views", {
    express: app,
    watch: true,
});
models_1.sequelize
    .sync({ force: false })
    .then(() => {
    console.log("데이터베이스 연결 성공");
})
    .catch((err) => {
    console.error(err);
});
if (process.env.NODE_ENV === "production") {
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
    }));
    app.use((0, hpp_1.default)());
    app.use((0, morgan_1.default)("combined"));
}
else {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { maxAge: 2592000000 }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(router_1.default);
const firstErrorHandler = async (err, req, res, next) => {
    try {
        const { place, content, user } = err;
        logger_1.logger.error(`loginId: ${user} / place: ${place} / content: ${content}`);
        if (user) {
            const targetUser = await models_1.User.findOne({ where: { loginId: user } });
            if (targetUser) {
                targetUser.loginCode = null;
                await targetUser.save();
            }
        }
        res.json({ answer: "error" });
    }
    catch (err) {
        logger_1.logger.error(err.message);
        res.json({ answer: "error" });
    }
};
const lastErrorHandler = async (err, req, res, next) => {
    try {
        res.json({ answer: "error" });
    }
    catch (err) {
        logger_1.logger.error(err.message);
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
