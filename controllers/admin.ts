import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { Maze, User, sequelize } from "../models";
import { ReqError } from "./common";
import { Op } from "sequelize";
const testSearchText = (
  category: "nick" | "loginId" | "cashCode",
  text: string
) => {
  let tester = /^(.*[a-z0-9가-힣]*)[a-z0-9가-힣]*$/;
  switch (category) {
    case "loginId": {
      tester = /^(.*[a-z0-9]*)[a-z0-9]*$/;
      break;
    }
    case "cashCode": {
      tester = /^[a-z0-9]*$/;
      break;
    }
  }
  return tester.test(text);
};
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
const adminLogin: RequestHandler = async (req, res, next) => {
  try {
    let { id, password } = req.body;
    id = `${id}`;
    password = `${password}`;
    const user = await User.findOne({ where: { loginId: id } });
    if (!user) {
      return res.json({ answer: "no user" });
    }
    if (!user.admin) {
      return res.json({ answer: "not admin" });
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
    err.place = "controllers-admin-login";
    err.content = "adminLoginError";
    err.user = null;
    next(err);
  }
};

const checkAdminLoginCode: RequestHandler = async (req, res, next) => {
  try {
    let { loginCode } = req.body;
    loginCode = `${loginCode}`;
    const user = await User.findOne({ where: { loginCode } });
    if (!user) {
      return res.json({ answer: "no user" });
    }
    if (!user.admin) {
      return res.json({ answer: "not admin" });
    }
    const newLoginCode = await bcrypt.hash(`${user.id}${Date.now()}`, 2);
    user.loginCode = newLoginCode;
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-checkAdminLoginCode",
        content: "checkAdminLoginCode transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    const mazes = await Maze.findAll({
      where: { level: { [Op.gte]: 1 } },
      attributes: [
        "level",
        "side",
        "startYCoord",
        "startXCoord",
        "destinationYCoord",
        "destinationXCoord",
      ],
      order: [["level", "ASC"]],
    });
    res.json({
      newLoginCode,
      mazes,
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-checkAdminLoginCode";
      err.content = "checkAdminLoginCodeError";
      err.user = null;
    }
    next(err);
  }
};
const searchUser: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { userLocked, userCharged } = req.body;
    let { searchText, userSearchTarget } = req.body;
    searchText = `${searchText}`;
    userSearchTarget = `${userSearchTarget}`;
    if (!["nick", "loginId", "cashCode"].includes(userSearchTarget)) {
      const errorObj = {
        place: "controllers-admin-searchUser",
        content: `invalid userSearchTarget! userSearchTarget: ${userSearchTarget}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const textTest = testSearchText(userSearchTarget, searchText);
    if (!textTest) {
      const errorObj = {
        place: "controllers-admin-searchUser",
        content: `invalid textTest! userSearchTarget: ${userSearchTarget} / searchText: ${searchText}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (![true, false].includes(userLocked)) {
      const errorObj = {
        place: "controllers-admin-searchUser",
        content: `invalid userLocked! userLocked: ${userLocked}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      ![true, false].includes(userCharged) ||
      (userCharged === false && userSearchTarget === "cashCode")
    ) {
      const errorObj = {
        place: "controllers-admin-searchUser",
        content: `invalid userCharged! userCharged: ${userCharged} (userSearchTarget: ${userSearchTarget})`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    let targetUsers: User[] = [];
    switch (userSearchTarget) {
      case "nick": {
        if (userLocked && userCharged && searchText === "") {
          targetUsers = await User.findAll({
            where: {
              lockMemo: { [Op.not]: "" },
              chargeCash: { [Op.gt]: 0 },
            },
            order: [["chargeTime", "ASC"]],
          });
        } else if (userLocked && userCharged) {
          targetUsers = await User.findAll({
            where: {
              nick: { [Op.like]: `%${searchText}%` },
              lockMemo: { [Op.not]: "" },
              chargeCash: { [Op.gt]: 0 },
            },
            order: [["chargeTime", "ASC"]],
          });
        } else if (userLocked && !userCharged && searchText === "") {
          targetUsers = await User.findAll({
            where: {
              lockMemo: { [Op.not]: "" },
              chargeCash: 0,
            },
          });
        } else if (userLocked && !userCharged) {
          targetUsers = await User.findAll({
            where: {
              nick: { [Op.like]: `%${searchText}%` },
              lockMemo: { [Op.not]: "" },
              chargeCash: 0,
            },
          });
        } else if (!userLocked && userCharged && searchText === "") {
          targetUsers = await User.findAll({
            where: {
              lockMemo: "",
              chargeCash: { [Op.gt]: 0 },
            },
            order: [["chargeTime", "ASC"]],
          });
        } else if (!userLocked && userCharged) {
          targetUsers = await User.findAll({
            where: {
              nick: { [Op.like]: `%${searchText}%` },
              lockMemo: "",
              chargeCash: { [Op.gt]: 0 },
            },
            order: [["chargeTime", "ASC"]],
          });
        } else if (!userLocked && !userCharged && searchText === "") {
          targetUsers = await User.findAll({
            where: {
              lockMemo: "",
              chargeCash: 0,
            },
          });
        } else if (!userLocked && !userCharged) {
          targetUsers = await User.findAll({
            where: {
              nick: { [Op.like]: `%${searchText}%` },
              lockMemo: "",
              chargeCash: 0,
            },
          });
        }
        break;
      }
      case "loginId": {
        if (userLocked && userCharged && searchText === "") {
          targetUsers = await User.findAll({
            where: {
              lockMemo: { [Op.not]: "" },
              chargeCash: { [Op.gt]: 0 },
            },
            order: [["chargeTime", "ASC"]],
          });
        } else if (userLocked && userCharged) {
          targetUsers = await User.findAll({
            where: {
              loginId: { [Op.like]: `%${searchText}%` },
              lockMemo: { [Op.not]: "" },
              chargeCash: { [Op.gt]: 0 },
            },
            order: [["chargeTime", "ASC"]],
          });
        } else if (userLocked && !userCharged && searchText === "") {
          targetUsers = await User.findAll({
            where: {
              lockMemo: { [Op.not]: "" },
              chargeCash: 0,
            },
          });
        } else if (userLocked && !userCharged) {
          targetUsers = await User.findAll({
            where: {
              loginId: { [Op.like]: `%${searchText}%` },
              lockMemo: { [Op.not]: "" },
              chargeCash: 0,
            },
          });
        } else if (!userLocked && userCharged && searchText === "") {
          targetUsers = await User.findAll({
            where: {
              lockMemo: "",
              chargeCash: { [Op.gt]: 0 },
            },
          });
        } else if (!userLocked && userCharged) {
          targetUsers = await User.findAll({
            where: {
              loginId: { [Op.like]: `%${searchText}%` },
              lockMemo: "",
              chargeCash: { [Op.gt]: 0 },
            },
            order: [["chargeTime", "ASC"]],
          });
        } else if (!userLocked && !userCharged && searchText === "") {
          targetUsers = await User.findAll({
            where: {
              lockMemo: "",
              chargeCash: 0,
            },
          });
        } else if (!userLocked && !userCharged) {
          targetUsers = await User.findAll({
            where: {
              loginId: { [Op.like]: `%${searchText}%` },
              lockMemo: "",
              chargeCash: 0,
            },
          });
        }
        break;
      }
      case "cashCode": {
        if (searchText === "") {
          if (userLocked) {
            targetUsers = await User.findAll({
              where: {
                lockMemo: { [Op.not]: "" },
                chargeCash: { [Op.gt]: 0 },
              },
              order: [["chargeTime", "ASC"]],
            });
          } else {
            targetUsers = await User.findAll({
              where: {
                lockMemo: "",
                chargeCash: { [Op.gt]: 0 },
              },
              order: [["chargeTime", "ASC"]],
            });
          }
        } else {
          const userId = parseInt(searchText, 36);
          if (!Number.isInteger(userId) || userId <= 0) {
            const errorObj = {
              place: "controllers-admin-searchUser",
              content: `invalid userId! userId: ${userId}`,
              user: user.loginId,
            };
            throw new ReqError(errorObj, errorObj.content);
          }
          if (userLocked) {
            const targetUser = await User.findOne({
              where: {
                id: userId,
                lockMemo: { [Op.not]: "" },
                chargeCash: { [Op.gt]: 0 },
              },
              order: [["chargeTime", "ASC"]],
            });
            if (targetUser) {
              targetUsers.push(targetUser);
            }
          } else {
            const targetUser = await User.findOne({
              where: {
                lockMemo: "",
                chargeCash: { [Op.gt]: 0 },
              },
              order: [["chargeTime", "ASC"]],
            });
            if (targetUser) {
              targetUsers.push(targetUser);
            }
          }
        }

        break;
      }
    }
    const targetUsersData: {
      userCode: string;
      loginId: string;
      nick: string;
      lockMemo: string;
      chargeCash: number;
      depositDeadLine: number;
    }[] = [];
    for (const user of targetUsers) {
      const { id, loginId, nick, lockMemo, chargeCash, depositDeadLine } = user;
      targetUsersData.push({
        userCode: id.toString(36),
        loginId,
        nick,
        lockMemo,
        chargeCash,
        depositDeadLine,
      });
    }
    res.json({ users: targetUsersData });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-searchUser";
      err.content = "searchUserError";
      err.user = null;
    }
    next(err);
  }
};
const checkDepositCompleted: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { targetUserLoginIdList } = req.body;
    if (!Array.isArray(targetUserLoginIdList)) {
      const errorObj = {
        place: "controllers-admin-checkDepositCompleted",
        content: `invalid targetUserLoginIdList! targetUserLoginIdList: ${targetUserLoginIdList}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    let targetUsers: User[] = [];
    for (const loginId of targetUserLoginIdList) {
      const loginIdTest = testLoginInfo("id", loginId);
      if (!loginIdTest) {
        const errorObj = {
          place: "controllers-admin-checkDepositCompleted",
          content: `invalid targetUserLoginIdList! targetUserLoginIdList: ${targetUserLoginIdList}`,
          user: user.loginId,
        };
        throw new ReqError(errorObj, errorObj.content);
      }
      const targetUser = await User.findOne({ where: { loginId } });
      if (!targetUser) {
        const errorObj = {
          place: "controllers-admin-checkDepositCompleted",
          content: `no targetUser!`,
          user: user.loginId,
        };
        throw new ReqError(errorObj, errorObj.content);
      }
      if (targetUser.chargeCash === 0) {
        const errorObj = {
          place: "controllers-admin-checkDepositCompleted",
          content: `no cashCode! loginId: ${loginId}`,
          user: user.loginId,
        };
        throw new ReqError(errorObj, errorObj.content);
      }
      targetUser.chargeCash = 0;
      targetUser.depositDeadLine = 0;
      targetUsers.push(targetUser);
    }
    const transaction = await sequelize.transaction();
    try {
      for (const user of targetUsers) {
        await user.save({ transaction });
      }
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-checkDepositCompleted",
        content: "checkDepositCompleted transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "checkDepositCompleted success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-checkDepositCompleted";
      err.content = "checkDepositCompletedError";
      err.user = null;
    }
    next(err);
  }
};
const changeNickInAdmin: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    let { targetUserLoginId, newNick } = req.body;
    targetUserLoginId = `${targetUserLoginId}`;
    newNick = `${newNick}`;
    const loginIdTest = testLoginInfo("id", targetUserLoginId);
    if (!loginIdTest) {
      const errorObj = {
        place: "controllers-admin-changeNickInAdmin",
        content: `invalid targetUserLoginId! targetUserLoginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const nickTest = testLoginInfo("nick", newNick);
    if (!nickTest) {
      const errorObj = {
        place: "controllers-admin-changeNickInAdmin",
        content: `invalid newNick! newNick: ${newNick}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const targetUser = await User.findOne({
      where: { loginId: targetUserLoginId },
    });
    if (!targetUser) {
      const errorObj = {
        place: "controllers-admin-changeNickInAdmin",
        content: `no user! loginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const existUser = await User.findOne({ where: { nick: newNick } });
    if (existUser) {
      return res.json({ answer: "nick exist" });
    }
    targetUser.nick = newNick;
    const transaction = await sequelize.transaction();
    try {
      await targetUser.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-changeNickInAdmin",
        content: "changeNickInAdmin transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "changeNickInAdmin success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-changeNickInAdmin";
      err.content = "changeNickInAdminError";
      err.user = null;
    }
    next(err);
  }
};
const changePasswordInAdmin: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    let { targetUserLoginId, newPassword } = req.body;
    targetUserLoginId = `${targetUserLoginId}`;
    newPassword = `${newPassword}`;
    const loginIdTest = testLoginInfo("id", targetUserLoginId);
    if (!loginIdTest) {
      const errorObj = {
        place: "controllers-admin-changePasswordInAdmin",
        content: `invalid targetUserLoginId! targetUserLoginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const passwordTest = testLoginInfo("password", newPassword);
    if (!passwordTest) {
      const errorObj = {
        place: "controllers-admin-changePasswordInAdmin",
        content: `invalid newPassword! newPassword: ${newPassword}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const targetUser = await User.findOne({
      where: { loginId: targetUserLoginId },
    });
    if (!targetUser) {
      const errorObj = {
        place: "controllers-admin-changePasswordInAdmin",
        content: `no user! loginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const hash = await bcrypt.hash(newPassword, 12);
    targetUser.password = hash;
    const transaction = await sequelize.transaction();
    try {
      await targetUser.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-changePasswordInAdmin",
        content: "changePasswordInAdmin transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "changePasswordInAdmin success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-changePasswordInAdmin";
      err.content = "changePasswordInAdminError";
      err.user = null;
    }
    next(err);
  }
};
const lockUser: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    let { targetUserLoginId, newLockMemo } = req.body;
    targetUserLoginId = `${targetUserLoginId}`;
    newLockMemo = `${newLockMemo}`;
    const loginIdTest = testLoginInfo("id", targetUserLoginId);
    if (!loginIdTest) {
      const errorObj = {
        place: "controllers-admin-lockUser",
        content: `invalid targetUserLoginId! targetUserLoginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const targetUser = await User.findOne({
      where: { loginId: targetUserLoginId },
    });
    if (!targetUser) {
      const errorObj = {
        place: "controllers-admin-lockUser",
        content: `no user! loginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (targetUser.lockMemo) {
      const errorObj = {
        place: "controllers-admin-lockUser",
        content: `already locked! loginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    targetUser.lockMemo = newLockMemo;
    const transaction = await sequelize.transaction();
    try {
      await targetUser.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-lockUser",
        content: "lockUser transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "lockUser success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-lockUser";
      err.content = "lockUserError";
      err.user = null;
    }
    next(err);
  }
};
const unlockUser: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    let { targetUserLoginId } = req.body;
    targetUserLoginId = `${targetUserLoginId}`;
    const loginIdTest = testLoginInfo("id", targetUserLoginId);
    if (!loginIdTest) {
      const errorObj = {
        place: "controllers-admin-unlockUser",
        content: `invalid targetUserLoginId! targetUserLoginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const targetUser = await User.findOne({
      where: { loginId: targetUserLoginId },
    });
    if (!targetUser) {
      const errorObj = {
        place: "controllers-admin-unlockUser",
        content: `no user! loginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (!targetUser.lockMemo) {
      const errorObj = {
        place: "controllers-admin-unlockUser",
        content: `already unlocked! loginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    targetUser.lockMemo = "";
    const transaction = await sequelize.transaction();
    try {
      await targetUser.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-unlockUser",
        content: "unlockUser transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "unlockUser success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-unlockUser";
      err.content = "unlockUserError";
      err.user = null;
    }
    next(err);
  }
};
const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    let { targetUserLoginId } = req.body;
    targetUserLoginId = `${targetUserLoginId}`;
    const loginIdTest = testLoginInfo("id", targetUserLoginId);
    if (!loginIdTest) {
      const errorObj = {
        place: "controllers-admin-deleteUser",
        content: `invalid targetUserLoginId! targetUserLoginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const targetUser = await User.findOne({
      where: { loginId: targetUserLoginId },
    });
    if (!targetUser) {
      const errorObj = {
        place: "controllers-admin-deleteUser",
        content: `no user! loginId: ${targetUserLoginId}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const transaction = await sequelize.transaction();
    try {
      await targetUser.destroy({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-deleteUser",
        content: "deleteUser transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "deleteUser success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-deleteUser";
      err.content = "deleteUserError";
      err.user = null;
    }
    next(err);
  }
};
const getMazeData: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { level } = req.body;
    if (!Number.isInteger(level) || level <= 0) {
      const errorObj = {
        place: "controllers-admin-getMazeData",
        content: `invalid level! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const maze = await Maze.findOne({
      where: { level },
      attributes: ["mazeData"],
    });
    if (!maze) {
      const errorObj = {
        place: "controllers-admin-getMazeData",
        content: `no maze! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    res.json({
      mazeData: maze.mazeData,
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-getMazeData";
      err.content = "getMazeDataError";
      err.user = null;
    }
    next(err);
  }
};
const addMaze: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const {
      level,
      side,
      startYCoord,
      startXCoord,
      destinationYCoord,
      destinationXCoord,
      mazeData,
    } = req.body;
    if (!Number.isInteger(level) || level <= 0) {
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: `invalid level! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const maze = await Maze.findOne({
      where: { level },
    });
    if (maze) {
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: `maze already exist! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(side) ||
      side <= 0 ||
      side / 10 !== Math.ceil(side / 10)
    ) {
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: `invalid side! side: ${side}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(startYCoord) ||
      startYCoord < 0 ||
      startYCoord >= side
    ) {
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: `invalid startYCoord! startYCoord: ${startYCoord}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(startXCoord) ||
      startXCoord < 0 ||
      startXCoord >= side
    ) {
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: `invalid startXCoord! startXCoord: ${startXCoord}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(destinationYCoord) ||
      destinationYCoord < 0 ||
      destinationYCoord >= side
    ) {
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: `invalid destinationYCoord! destinationYCoord: ${destinationYCoord}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(destinationXCoord) ||
      destinationXCoord < 0 ||
      destinationXCoord >= side
    ) {
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: `invalid destinationXCoord! destinationXCoord: ${destinationXCoord}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (mazeData.length !== side ** 2 || !/^[0-9a-fz]+$/.test(mazeData)) {
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: `invalid mazeData! mazeData: ${mazeData}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const transaction = await sequelize.transaction();
    try {
      await Maze.create(
        {
          level,
          side,
          startYCoord,
          startXCoord,
          destinationYCoord,
          destinationXCoord,
          mazeData,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-addMaze",
        content: "addMaze transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({
      answer: "addMaze success",
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-addMaze";
      err.content = "addMazeError";
      err.user = null;
    }
    next(err);
  }
};
const updateMaze: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const {
      level,
      side,
      startYCoord,
      startXCoord,
      destinationYCoord,
      destinationXCoord,
      mazeData,
    } = req.body;
    if (!Number.isInteger(level) || level <= 0) {
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: `invalid level! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const maze = await Maze.findOne({
      where: { level },
    });
    if (!maze) {
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: `no maze! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(side) ||
      side <= 0 ||
      side / 10 !== Math.ceil(side / 10)
    ) {
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: `invalid side! side: ${side}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(startYCoord) ||
      startYCoord < 0 ||
      startYCoord >= side
    ) {
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: `invalid startYCoord! startYCoord: ${startYCoord}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(startXCoord) ||
      startXCoord < 0 ||
      startXCoord >= side
    ) {
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: `invalid startXCoord! startXCoord: ${startXCoord}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(destinationYCoord) ||
      destinationYCoord < 0 ||
      destinationYCoord >= side
    ) {
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: `invalid destinationYCoord! destinationYCoord: ${destinationYCoord}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(destinationXCoord) ||
      destinationXCoord < 0 ||
      destinationXCoord >= side
    ) {
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: `invalid destinationXCoord! destinationXCoord: ${destinationXCoord}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (mazeData.length !== side ** 2 || !/^[0-9a-fz]+$/.test(mazeData)) {
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: `invalid mazeData! mazeData: ${mazeData}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    maze.side = side;
    maze.startYCoord = startYCoord;
    maze.startXCoord = startXCoord;
    maze.destinationYCoord = destinationYCoord;
    maze.destinationXCoord = destinationXCoord;
    maze.mazeData = mazeData;
    const transaction = await sequelize.transaction();
    try {
      await maze.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-updateMaze",
        content: "updateMaze transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({
      answer: "updateMaze success",
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-updateMaze";
      err.content = "updateMazeError";
      err.user = null;
    }
    next(err);
  }
};
const deleteMaze: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { level } = req.body;
    if (!Number.isInteger(level) || level <= 0) {
      const errorObj = {
        place: "controllers-admin-deleteMaze",
        content: `invalid level! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const maze = await Maze.findOne({
      where: { level },
    });
    if (!maze) {
      const errorObj = {
        place: "controllers-admin-deleteMaze",
        content: `no maze! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const transaction = await sequelize.transaction();
    try {
      await maze.destroy({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-admin-deleteMaze",
        content: "deleteMaze transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({
      answer: "deleteMaze success",
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-admin-deleteMaze";
      err.content = "deleteMazeError";
      err.user = null;
    }
    next(err);
  }
};
export {
  adminLogin,
  checkAdminLoginCode,
  searchUser,
  checkDepositCompleted,
  changeNickInAdmin,
  changePasswordInAdmin,
  lockUser,
  unlockUser,
  deleteUser,
  getMazeData,
  addMaze,
  updateMaze,
  deleteMaze,
};
