"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.changeNick = exports.leave = exports.login = exports.join = exports.checkLoginCode = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const common_1 = require("./common");
const testLoginInfo = (category, text) => {
    let tester = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/;
    switch (category) {
        case "id": {
            tester = /^(?=.*[a-z0-9])[a-z0-9]{6,16}$/;
            break;
        }
        case "password": {
            tester = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
            break;
        }
    }
    return tester.test(text);
};
const checkLoginCode = async (req, res, next) => {
    try {
        let { loginCode } = req.body;
        loginCode = `${loginCode}`;
        const user = await models_1.User.findOne({ where: { loginCode } });
        if (!user) {
            return res.json({ answer: "no user" });
        }
        if (user.lockMemo) {
            const errorObj = {
                place: "controllers-auth-checkLoginCode",
                content: `user locked!`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const todayStartTime = (0, common_1.getTodayStartTime)();
        if (user.latestPotionReceiveTime < todayStartTime) {
            user.potion += 3;
            user.latestPotionReceiveTime = todayStartTime;
            if (user.hp === 0) {
                user.hp = 1000;
                user.potion--;
            }
        }
        const newLoginCode = await bcrypt_1.default.hash(`${user.id}${Date.now()}`, 2);
        user.loginCode = newLoginCode;
        const userData = JSON.parse(JSON.stringify(user));
        delete userData.password;
        delete userData.loginCode;
        delete userData.latestPotionReceiveTime;
        delete userData.lockMemo;
        delete userData.admin;
        delete userData.inviterCode;
        delete userData.createdAt;
        delete userData.updatedAt;
        delete userData.deletedAt;
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-auth-checkLoginCode",
                content: "checkLoginCode transaction error",
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({
            newLoginCode,
            userData,
        });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-auth-checkLoginCode";
            err.content = "checkLoginCodeError";
            err.user = null;
        }
        next(err);
    }
};
exports.checkLoginCode = checkLoginCode;
const join = async (req, res, next) => {
    try {
        const { nick, id, password, passwordCheck, inviterCode } = req.body;
        const nickTest = testLoginInfo("nick", nick);
        const idTest = testLoginInfo("id", id);
        const passwordTest = testLoginInfo("password", password);
        if (!nick ||
            !id ||
            !password ||
            !passwordCheck ||
            password !== passwordCheck ||
            !nickTest ||
            !idTest ||
            !passwordTest ||
            (inviterCode && typeof inviterCode !== "string")) {
            const errorObj = {
                place: "controllers-auth-join",
                content: `banned join! nick:${nick} / id:${id} / password:${password} / passwordCheck:${passwordCheck} / inviterCode:${inviterCode}`,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const exNick = await models_1.User.findOne({ where: { nick } });
        const exId = await models_1.User.findOne({ where: { loginId: id } });
        if (exNick || exId) {
            return res.json({
                nickExist: exNick === null ? false : true,
                idExist: exId === null ? false : true,
            });
        }
        let inviterExist = false;
        if (inviterCode && /^[a-z0-9]{7}$/.test(inviterCode)) {
            const inviterId = parseInt(inviterCode, 36);
            const inviter = await models_1.User.findOne({ where: { id: inviterId } });
            if (inviter && inviter.inviteNumbers < 100) {
                inviterExist = true;
            }
        }
        const hash = await bcrypt_1.default.hash(password, 12);
        let currentMazeSide = 20;
        let currentMazeStartYCoord = 0;
        let currentMazeStartXCoord = 0;
        let currentMazeDestinationYCoord = 19;
        let currentMazeDestinationXCoord = 19;
        let currentMazeData = "0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
        const firstMaze = await models_1.Maze.findOne({ where: { level: 1 } });
        if (firstMaze) {
            const { side, startYCoord, startXCoord, destinationYCoord, destinationXCoord, } = firstMaze;
            currentMazeSide = side;
            currentMazeStartYCoord = startYCoord;
            currentMazeStartXCoord = startXCoord;
            currentMazeDestinationYCoord = destinationYCoord;
            currentMazeDestinationXCoord = destinationXCoord;
            currentMazeData = (0, common_1.getNewMazeData)(firstMaze);
        }
        const transaction = await models_1.sequelize.transaction();
        try {
            await models_1.User.create({
                nick,
                loginId: id,
                password: hash,
                hp: 1000,
                potion: inviterCode !== "" ? 2 : 1,
                currentMazeSide,
                currentMazeYCoord: currentMazeStartYCoord,
                currentMazeXCoord: currentMazeStartXCoord,
                currentMazeStartYCoord,
                currentMazeStartXCoord,
                currentMazeDestinationYCoord,
                currentMazeDestinationXCoord,
                currentMazeData,
                inviterCode: inviterExist ? inviterCode : null,
            }, { transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-auth-join",
                content: "join transaction error",
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        return res.json({ answer: "join success" });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-auth-join";
            err.content = "joinError";
            err.user = null;
        }
        next(err);
    }
};
exports.join = join;
const login = async (req, res, next) => {
    try {
        let { id, password } = req.body;
        id = `${id}`;
        password = `${password}`;
        const user = await models_1.User.findOne({ where: { loginId: id } });
        if (!user) {
            return res.json({ answer: "no user" });
        }
        const result = await bcrypt_1.default.compare(password, user.password);
        if (!result) {
            return res.json({ answer: "no user" });
        }
        if (user.lockMemo) {
            return res.json({ answer: "lock" });
        }
        const loginCode = await bcrypt_1.default.hash(`${id}${Date.now()}`, 2);
        user.loginCode = loginCode;
        await user.save();
        res.json({ loginCode });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-auth-login";
            err.content = "loginError";
            err.user = null;
        }
        next(err);
    }
};
exports.login = login;
const leave = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { password } = req.body;
        const passwordTester = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
        if (!passwordTester.test(password)) {
            const errorObj = {
                place: "controllers-auth-leave",
                content: `invalid password! password: ${password}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const result = await bcrypt_1.default.compare(password, user.password);
        if (!result) {
            return res.json({ answer: "no user" });
        }
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.destroy({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-auth-leave",
                content: `leave transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({ answer: "leave success" });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-auth-leave";
            err.content = "leaveError";
            err.user = null;
        }
        next(err);
    }
};
exports.leave = leave;
const changeNick = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { newNick } = req.body;
        const nickTester = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/;
        if (!nickTester.test(newNick)) {
            const errorObj = {
                place: "controllers-auth-changeNick",
                content: `invalid newNick! newNick: ${newNick}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const nickExist = await models_1.User.findOne({ where: { nick: newNick } });
        if (nickExist) {
            return res.json({ answer: "nick exist" });
        }
        user.nick = newNick;
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-auth-changeNick",
                content: `changeNick transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({ answer: "changeNick success" });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-auth-changeNick";
            err.content = "changeNickError";
            err.user = null;
        }
        next(err);
    }
};
exports.changeNick = changeNick;
const changePassword = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { newPassword } = req.body;
        const passwordTester = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
        if (!passwordTester.test(newPassword)) {
            const errorObj = {
                place: "controllers-auth-changePassword",
                content: `invalid newPassword! newPassword: ${newPassword}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const hash = await bcrypt_1.default.hash(newPassword, 12);
        user.password = hash;
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-auth-changePassword",
                content: `changePassword transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({ answer: "changePassword success" });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-auth-changePassword";
            err.content = "changePasswordError";
            err.user = null;
        }
        next(err);
    }
};
exports.changePassword = changePassword;
