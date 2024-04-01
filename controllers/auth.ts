import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { Maze, User, sequelize } from "../models";
import { ReqError, getNewMazeData, getTodayStartTime } from "./common";

const testLoginInfo = (category: "nick" | "id" | "password", text: string) => {
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
const checkLoginCode: RequestHandler = async (req, res, next) => {
  try {
    let { loginCode } = req.body;
    loginCode = `${loginCode}`;
    const user = await User.findOne({ where: { loginCode } });
    if (!user) {
      return res.json({ answer: "no user" });
    }
    if (user.lockMemo) {
      const errorObj = {
        place: "controllers-auth-checkLoginCode",
        content: `user locked!`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const todayStartTime = getTodayStartTime();
    if (user.latestPotionReceiveTime < todayStartTime) {
      user.potion += 3;
      user.latestPotionReceiveTime = todayStartTime;
      if (user.hp === 0) {
        user.hp = 1000;
        user.potion--;
      }
    }
    const newLoginCode = await bcrypt.hash(`${user.id}${Date.now()}`, 2);
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
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-checkLoginCode",
        content: "checkLoginCode transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({
      newLoginCode,
      userData,
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-checkLoginCode";
      err.content = "checkLoginCodeError";
      err.user = null;
    }
    next(err);
  }
};
const join: RequestHandler = async (req, res, next) => {
  try {
    const { nick, id, password, passwordCheck, inviterCode } = req.body;
    const nickTest = testLoginInfo("nick", nick);
    const idTest = testLoginInfo("id", id);
    const passwordTest = testLoginInfo("password", password);
    if (
      !nick ||
      !id ||
      !password ||
      !passwordCheck ||
      password !== passwordCheck ||
      !nickTest ||
      !idTest ||
      !passwordTest ||
      (inviterCode && typeof inviterCode !== "string")
    ) {
      const errorObj = {
        place: "controllers-auth-join",
        content: `banned join! nick:${nick} / id:${id} / password:${password} / passwordCheck:${passwordCheck} / inviterCode:${inviterCode}`,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const exNick = await User.findOne({ where: { nick } });
    const exId = await User.findOne({ where: { loginId: id } });
    if (exNick || exId) {
      return res.json({
        nickExist: exNick === null ? false : true,
        idExist: exId === null ? false : true,
      });
    }
    let inviterExist = false;
    if (inviterCode && /^[a-z0-9]{7}$/.test(inviterCode)) {
      const inviterId = parseInt(inviterCode, 36);
      const inviter = await User.findOne({ where: { id: inviterId } });
      if (inviter && inviter.inviteNumbers < 100) {
        inviterExist = true;
      }
    }
    const hash = await bcrypt.hash(password, 12);
    let currentMazeSide = 20;
    let currentMazeStartYCoord = 0;
    let currentMazeStartXCoord = 0;
    let currentMazeDestinationYCoord = 19;
    let currentMazeDestinationXCoord = 19;
    let currentMazeData =
      "0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzz0000000000zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
    const firstMaze = await Maze.findOne({ where: { level: 1 } });
    if (firstMaze) {
      const {
        side,
        startYCoord,
        startXCoord,
        destinationYCoord,
        destinationXCoord,
      } = firstMaze;
      currentMazeSide = side;
      currentMazeStartYCoord = startYCoord;
      currentMazeStartXCoord = startXCoord;
      currentMazeDestinationYCoord = destinationYCoord;
      currentMazeDestinationXCoord = destinationXCoord;
      currentMazeData = getNewMazeData(firstMaze);
    }
    const transaction = await sequelize.transaction();
    try {
      await User.create(
        {
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
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-join",
        content: "join transaction error",
      };
      throw new ReqError(errorObj, err.message);
    }
    return res.json({ answer: "join success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-join";
      err.content = "joinError";
      err.user = null;
    }
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    let { id, password } = req.body;
    id = `${id}`;
    password = `${password}`;
    const user = await User.findOne({ where: { loginId: id } });
    if (!user) {
      return res.json({ answer: "no user" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.json({ answer: "no user" });
    }
    if (user.lockMemo) {
      return res.json({ answer: "lock" });
    }
    const loginCode = await bcrypt.hash(`${id}${Date.now()}`, 2);
    user.loginCode = loginCode;
    await user.save();
    res.json({ loginCode });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-login";
      err.content = "loginError";
      err.user = null;
    }
    next(err);
  }
};
const leave: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { password } = req.body;
    const passwordTester =
      /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
    if (!passwordTester.test(password)) {
      const errorObj = {
        place: "controllers-auth-leave",
        content: `invalid password! password: ${password}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.json({ answer: "no user" });
    }
    const transaction = await sequelize.transaction();
    try {
      await user.destroy({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-leave",
        content: `leave transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "leave success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-leave";
      err.content = "leaveError";
      err.user = null;
    }
    next(err);
  }
};
const changeNick: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { newNick } = req.body;
    const nickTester = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/;
    if (!nickTester.test(newNick)) {
      const errorObj = {
        place: "controllers-auth-changeNick",
        content: `invalid newNick! newNick: ${newNick}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const nickExist = await User.findOne({ where: { nick: newNick } });
    if (nickExist) {
      return res.json({ answer: "nick exist" });
    }
    user.nick = newNick;
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-changeNick",
        content: `changeNick transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "changeNick success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-changeNick";
      err.content = "changeNickError";
      err.user = null;
    }
    next(err);
  }
};
const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { newPassword } = req.body;
    const passwordTester =
      /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
    if (!passwordTester.test(newPassword)) {
      const errorObj = {
        place: "controllers-auth-changePassword",
        content: `invalid newPassword! newPassword: ${newPassword}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const hash = await bcrypt.hash(newPassword, 12);
    user.password = hash;
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-changePassword",
        content: `changePassword transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "changePassword success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-changePassword";
      err.content = "changePasswordError";
      err.user = null;
    }
    next(err);
  }
};
export { checkLoginCode, join, login, leave, changeNick, changePassword };
