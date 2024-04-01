"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCurrentData = exports.enterNewMaze = exports.enterNewPart = void 0;
const models_1 = require("../models");
const common_1 = require("./common");
const checkLog = (user, moveLog, resultHp, resultYCoord, resultXCoord) => {
    let { hp, currentMazeYCoord, currentMazeXCoord } = user;
    const { currentMazeSide, currentMazeData } = user;
    for (const move of moveLog) {
        hp--;
        if (hp < 0) {
            return false;
        }
        const currentRoom = currentMazeData[currentMazeSide * currentMazeYCoord + currentMazeXCoord];
        switch (move) {
            case "up": {
                if (!["1", "3", "5", "7", "9", "b", "d", "f"].includes(currentRoom)) {
                    return false;
                }
                currentMazeYCoord--;
                break;
            }
            case "down": {
                if (!["2", "3", "6", "7", "a", "b", "e", "f"].includes(currentRoom)) {
                    return false;
                }
                currentMazeYCoord++;
                break;
            }
            case "left": {
                if (!["4", "5", "6", "7", "c", "d", "e", "f"].includes(currentRoom)) {
                    return false;
                }
                currentMazeXCoord--;
                break;
            }
            case "right": {
                if (!["8", "9", "a", "b", "c", "d", "e", "f"].includes(currentRoom)) {
                    return false;
                }
                currentMazeXCoord++;
                break;
            }
        }
    }
    if (resultHp !== hp ||
        resultYCoord !== currentMazeYCoord ||
        resultXCoord !== currentMazeXCoord) {
        return false;
    }
    return true;
};
const enterNewPart = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { moveLog, resultHp, resultYCoord, resultXCoord } = req.body;
        if (!Array.isArray(moveLog) ||
            moveLog.length === 0 ||
            moveLog.length > 1000) {
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `invalid moveLog! moveLog: ${moveLog}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const moveValues = ["up", "down", "left", "right"];
        const filteredMoveLog = moveLog.filter((move) => moveValues.includes(move));
        if (filteredMoveLog.length !== moveLog.length) {
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `invalid moveLog! moveLog: ${moveLog}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const { hp, potion, currentMazeSide, currentMazeLevel, currentMazeData } = user;
        if (!Number.isInteger(resultHp) ||
            resultHp < 0 ||
            resultHp !== hp - moveLog.length) {
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `invalid resultHp! resultHp: ${resultHp}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!Number.isInteger(resultYCoord) ||
            resultYCoord < 0 ||
            resultYCoord >= currentMazeSide) {
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `invalid resultYCoord! resultYCoord: ${resultYCoord}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!Number.isInteger(resultXCoord) ||
            resultXCoord < 0 ||
            resultXCoord >= currentMazeSide) {
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `invalid resultXCoord! resultXCoord: ${resultXCoord}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const logValidity = checkLog(user, moveLog, resultHp, resultYCoord, resultXCoord);
        if (!logValidity) {
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `invalid moveLog!`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const currentRoom = currentMazeData[resultYCoord * currentMazeSide + resultXCoord];
        if (currentRoom !== "z") {
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `invalid currentRoom! currentRoom: ${currentRoom}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const targetMaze = await models_1.Maze.findOne({
            where: { level: currentMazeLevel },
        });
        if (!targetMaze) {
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `no maze! targetMaze: ${targetMaze}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const newUserMazeData = (0, common_1.updateMazeData)(currentMazeData, targetMaze.mazeData, resultYCoord, resultXCoord);
        if (resultHp === 0 && potion > 0) {
            user.hp = 1000;
            user.potion--;
        }
        else {
            user.hp = resultHp;
        }
        user.currentMazeYCoord = resultYCoord;
        user.currentMazeXCoord = resultXCoord;
        user.currentMazeData = newUserMazeData;
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-maze-enterNewPart",
                content: `enterNewPart transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({ newUserMazeData });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-maze-enterNewPart";
            err.content = "enterNewPartError";
            err.user = null;
        }
        next(err);
    }
};
exports.enterNewPart = enterNewPart;
const enterNewMaze = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { moveLog, resultHp } = req.body;
        if (!Array.isArray(moveLog) ||
            moveLog.length === 0 ||
            moveLog.length > 1000) {
            const errorObj = {
                place: "controllers-maze-enterNewMaze",
                content: `invalid moveLog! moveLog: ${moveLog}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const moveValues = ["up", "down", "left", "right"];
        const filteredMoveLog = moveLog.filter((move) => moveValues.includes(move));
        if (filteredMoveLog.length !== moveLog.length) {
            const errorObj = {
                place: "controllers-maze-enterNewMaze",
                content: `invalid moveLog! moveLog: ${moveLog}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const { hp, potion, currentMazeLevel, currentMazeDestinationYCoord, currentMazeDestinationXCoord, } = user;
        if (!Number.isInteger(resultHp) ||
            resultHp < 0 ||
            resultHp !== hp - moveLog.length) {
            const errorObj = {
                place: "controllers-maze-enterNewMaze",
                content: `invalid resultHp! resultHp: ${resultHp}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const logValidity = checkLog(user, moveLog, resultHp, currentMazeDestinationYCoord, currentMazeDestinationXCoord);
        if (!logValidity) {
            const errorObj = {
                place: "controllers-maze-enterNewMaze",
                content: `invalid moveLog!`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const nextLevel = currentMazeLevel + 1;
        const nextMaze = await models_1.Maze.findOne({ where: { level: nextLevel } });
        if (!nextMaze) {
            user.hp = resultHp + 1;
            user.currentMazeYCoord = currentMazeDestinationYCoord;
            user.currentMazeXCoord = currentMazeDestinationXCoord;
            const lastMove = moveLog[moveLog.length - 1];
            switch (lastMove) {
                case "up": {
                    user.currentMazeYCoord++;
                    break;
                }
                case "down": {
                    user.currentMazeYCoord--;
                    break;
                }
                case "left": {
                    user.currentMazeXCoord++;
                    break;
                }
                case "right": {
                    user.currentMazeXCoord--;
                    break;
                }
            }
            const transaction = await models_1.sequelize.transaction();
            try {
                await user.save({ transaction });
                await transaction.commit();
            }
            catch (err) {
                await transaction.rollback();
                const errorObj = {
                    place: "controllers-maze-enterNewMaze",
                    content: `enterNewMaze transaction (no next level) error`,
                    user: user.loginId,
                };
                throw new common_1.ReqError(errorObj, err.message);
            }
            return res.json({ answer: "no next level" });
        }
        let inviter = null;
        let inviteEventAvailable = false;
        if (nextLevel === 3 && user.inviterCode) {
            const inviterId = parseInt(user.inviterCode, 36);
            inviter = await models_1.User.findOne({ where: { id: inviterId } });
            if (inviter && inviter.inviteNumbers < 100) {
                inviter.inviteNumbers++;
                inviter.potion++;
                inviteEventAvailable = true;
            }
        }
        const { side, startYCoord, startXCoord, destinationYCoord, destinationXCoord, } = nextMaze;
        if (resultHp === 0 && potion > 0) {
            user.hp = 1000;
            user.potion--;
        }
        else {
            user.hp = resultHp;
        }
        user.currentMazeLevel = nextLevel;
        user.currentMazeSide = side;
        user.currentMazeYCoord = startYCoord;
        user.currentMazeXCoord = startXCoord;
        user.currentMazeStartYCoord = startYCoord;
        user.currentMazeStartXCoord = startXCoord;
        user.currentMazeDestinationYCoord = destinationYCoord;
        user.currentMazeDestinationXCoord = destinationXCoord;
        const newMazeData = (0, common_1.getNewMazeData)(nextMaze);
        user.currentMazeData = newMazeData;
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            if (inviteEventAvailable) {
                await inviter.save({ transaction });
            }
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-maze-enterNewMaze",
                content: `enterNewMaze transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({
            currentMazeSide: side,
            startYCoord,
            startXCoord,
            destinationYCoord,
            destinationXCoord,
            newMazeData,
        });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-maze-enterNewMaze";
            err.content = "enterNewMazeError";
            err.user = null;
        }
        next(err);
    }
};
exports.enterNewMaze = enterNewMaze;
const saveCurrentData = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { moveLog, resultHp, resultYCoord, resultXCoord } = req.body;
        if (!Array.isArray(moveLog) ||
            moveLog.length === 0 ||
            moveLog.length > 1000) {
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `invalid moveLog! moveLog: ${moveLog}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const moveValues = ["up", "down", "left", "right"];
        const filteredMoveLog = moveLog.filter((move) => moveValues.includes(move));
        if (filteredMoveLog.length !== moveLog.length) {
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `invalid moveLog! moveLog: ${moveLog}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const { hp, potion, currentMazeSide, currentMazeDestinationYCoord, currentMazeDestinationXCoord, currentMazeData, } = user;
        if (!Number.isInteger(resultHp) ||
            resultHp < 0 ||
            resultHp !== hp - moveLog.length) {
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `invalid resultHp! resultHp: ${resultHp}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!Number.isInteger(resultYCoord) ||
            resultYCoord < 0 ||
            resultYCoord >= currentMazeSide) {
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `invalid resultYCoord! resultYCoord: ${resultYCoord}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!Number.isInteger(resultXCoord) ||
            resultXCoord < 0 ||
            resultXCoord >= currentMazeSide) {
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `invalid resultXCoord! resultXCoord: ${resultXCoord}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const logValidity = checkLog(user, moveLog, resultHp, resultYCoord, resultXCoord);
        if (!logValidity) {
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `invalid moveLog!`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const currentRoom = currentMazeData[resultYCoord * currentMazeSide + resultXCoord];
        if (currentRoom === "z") {
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `currentRoom in unexperienced part!`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (resultYCoord === currentMazeDestinationYCoord &&
            resultXCoord === currentMazeDestinationXCoord) {
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `currentRoom is destination!`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (resultHp === 0 && potion > 0) {
            user.hp = 1000;
            user.potion--;
        }
        else {
            user.hp = resultHp;
        }
        user.currentMazeYCoord = resultYCoord;
        user.currentMazeXCoord = resultXCoord;
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-maze-saveCurrentData",
                content: `saveCurrentData transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({ answer: "saveCurrentData success" });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-maze-saveCurrentData";
            err.content = "saveCurrentDataError";
            err.user = null;
        }
        next(err);
    }
};
exports.saveCurrentData = saveCurrentData;
