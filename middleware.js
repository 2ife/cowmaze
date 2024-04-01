"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminLoggedIn = exports.isNotLoggedIn = exports.isLoggedIn = exports.apiLimiter = void 0;
const common_1 = require("./controllers/common");
const index_1 = require("./models/index");
const express_rate_limit_1 = require("express-rate-limit");
const logger_1 = require("./logger");
const getIp = (req) => {
    return req.headers["x-forwarded-for"]
        ? `${req.headers["x-forwarded-for"].split(",")[0]}`
        : "Math.random()";
};
const apiLimiter = (0, express_rate_limit_1.rateLimit)({
    keyGenerator: getIp,
    windowMs: 60000,
    max: 60,
    handler(req, res) {
        logger_1.logger.info(`rateLimit over (ip:${getIp})`);
        res.send("단기간 내 너무 많은 데이터를 요청하여 1분 이후에 접속 바랍니다.");
    },
});
exports.apiLimiter = apiLimiter;
const isLoggedIn = async (req, res, next) => {
    try {
        const { loginCode } = req.body;
        if (!loginCode) {
            const errorObj = {
                place: "middlewares-isLoggedIn",
                content: "no loginCode!",
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const user = await index_1.User.findOne({ where: { loginCode } });
        if (!user) {
            const errorObj = {
                place: "middlewares-isLoggedIn",
                content: "no user!",
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (user.lockMemo) {
            const errorObj = {
                place: "middlewares-isLoggedIn",
                content: "user locked!",
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        res.locals.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.isLoggedIn = isLoggedIn;
const isNotLoggedIn = async (req, res, next) => {
    try {
        const { loginCode } = req.body;
        if (loginCode) {
            const user = await index_1.User.findOne({ where: { loginCode } });
            if (user) {
                const errorObj = {
                    place: "middlewares-isNotLoggedIn",
                    content: `already loggedIn! user id: ${user.id}`,
                    user: user.loginId,
                };
                throw new common_1.ReqError(errorObj, errorObj.content);
            }
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.isNotLoggedIn = isNotLoggedIn;
const isAdminLoggedIn = async (req, res, next) => {
    try {
        const { loginCode } = req.body;
        if (!loginCode) {
            const errorObj = {
                place: "middlewares-isAdminLoggedIn",
                content: "no loginCode!",
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const user = await index_1.User.findOne({ where: { loginCode } });
        if (!user) {
            const errorObj = {
                place: "middlewares-isAdminLoggedIn",
                content: "no user!",
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!user.admin) {
            const errorObj = {
                place: "middlewares-isAdminLoggedIn",
                content: "not admin!",
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (user.lockMemo) {
            const errorObj = {
                place: "middlewares-isAdminLoggedIn",
                content: "user locked!",
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        res.locals.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.isAdminLoggedIn = isAdminLoggedIn;
