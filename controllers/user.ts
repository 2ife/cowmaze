import { RequestHandler } from "express";
import { Maze, User, sequelize } from "../models";
import { Op } from "sequelize";
import { ReqError, errorObj, getTodayStartTime } from "./common";

const getRankInfo: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const currentRankersDataBody = await Maze.findOne({ where: { level: 0 } });
    let needToUpdate = true;
    let rankersStrData = "";
    let rankersData: { nick: string; level: number }[] = [];
    if (currentRankersDataBody) {
      const currentRankersAndTimeStrData = currentRankersDataBody.mazeData;
      const timeEndIndex = currentRankersAndTimeStrData.indexOf(")");
      const lastUpdateTime = Number(
        currentRankersAndTimeStrData.slice(0, timeEndIndex)
      );
      const todayStartTime = getTodayStartTime();
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
      const rankers = await User.findAll({
        where: {
          admin: false,
          lockMemo: "",
          currentMazeLevel: { [Op.gte]: 2 },
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
        rankersStrData += `${rankersStrData === "" ? "" : "/"}${ranker.nick}_${
          ranker.currentMazeLevel
        }`;
      }
      const now = Date.now();
      const transaction = await sequelize.transaction();
      try {
        if (currentRankersDataBody) {
          currentRankersDataBody.destroy({ transaction });
        }
        if (rankers.length > 0) {
          await Maze.create(
            {
              level: 0,
              side: 0,
              startYCoord: 0,
              startXCoord: 0,
              destinationYCoord: 0,
              destinationXCoord: 0,
              mazeData: `${now})${rankersStrData}`,
            },
            { transaction }
          );
        }
        await transaction.commit();
      } catch (err: any) {
        await transaction.rollback();
        const errorObj: errorObj = {
          place: "controllers-auth-getRankInfo",
          content: `getRankInfo transaction error`,
          user: user.loginId,
        };
        throw new ReqError(errorObj, err.message);
      }
    } else {
    }

    res.json({
      rankersData,
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-user-getRankInfo";
      err.content = "getRankInfoError";
      err.user = null;
    }
    next(err);
  }
};

export { getRankInfo };
