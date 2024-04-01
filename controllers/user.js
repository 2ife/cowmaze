"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRankInfo = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const common_1 = require("./common");
const getRankInfo = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const currentRankersDataBody = await models_1.Maze.findOne({ where: { level: 0 } });
        let needToUpdate = true;
        let rankersStrData = "";
        let rankersData = [];
        if (currentRankersDataBody) {
            const currentRankersAndTimeStrData = currentRankersDataBody.mazeData;
            const timeEndIndex = currentRankersAndTimeStrData.indexOf(")");
            const lastUpdateTime = Number(currentRankersAndTimeStrData.slice(0, timeEndIndex));
            const todayStartTime = (0, common_1.getTodayStartTime)();
            if (lastUpdateTime >= todayStartTime) {
                needToUpdate = false;
                rankersStrData = currentRankersAndTimeStrData.slice(timeEndIndex + 1);
                rankersData = rankersStrData.split("/").map((rankerStrData) => {
                    const dividerIndex = rankerStrData.indexOf("_");
                    const nick = rankerStrData.slice(0, dividerIndex);
                    const level = Number(rankerStrData.slice(dividerIndex + 1));
                    return { nick, level };
                });
            }
        }
        if (needToUpdate) {
            const rankers = await models_1.User.findAll({
                where: {
                    admin: false,
                    lockMemo: "",
                    currentMazeLevel: { [sequelize_1.Op.gte]: 2 },
                },
                order: [["currentMazeLevel", "DESC"]],
                limit: 12,
            });
            for (const ranker of rankers) {
                const { nick, currentMazeLevel } = ranker;
                rankersData.push({
                    nick,
                    level: currentMazeLevel,
                });
                rankersStrData += `${rankersStrData === "" ? "" : "/"}${ranker.nick}_${ranker.currentMazeLevel}`;
            }
            const now = Date.now();
            const transaction = await models_1.sequelize.transaction();
            try {
                if (currentRankersDataBody) {
                    currentRankersDataBody.destroy({ transaction });
                }
                if (rankers.length > 0) {
                    await models_1.Maze.create({
                        level: 0,
                        side: 0,
                        startYCoord: 0,
                        startXCoord: 0,
                        destinationYCoord: 0,
                        destinationXCoord: 0,
                        mazeData: `${now})${rankersStrData}`,
                    }, { transaction });
                }
                await transaction.commit();
            }
            catch (err) {
                await transaction.rollback();
                const errorObj = {
                    place: "controllers-auth-getRankInfo",
                    content: `getRankInfo transaction error`,
                    user: user.loginId,
                };
                throw new common_1.ReqError(errorObj, err.message);
            }
        }
        else {
        }
        res.json({
            rankersData,
        });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-user-getRankInfo";
            err.content = "getRankInfoError";
            err.user = null;
        }
        next(err);
    }
};
exports.getRankInfo = getRankInfo;
