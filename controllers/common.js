"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMazeData = exports.getNewMazeData = exports.getTodayStartTime = exports.ReqError = void 0;
class ReqError extends Error {
    constructor(obj, msg) {
        super(msg);
        this.place = obj.place;
        this.content = obj.content;
        this.user = obj.user ? obj.user : null;
    }
}
exports.ReqError = ReqError;
const getTodayStartTime = () => {
    const currentDate = new Date();
    const UTCYear = currentDate.getUTCFullYear();
    const UTCMonth = currentDate.getUTCMonth();
    const UTCDate = currentDate.getUTCDate();
    const todayStartTime = Date.UTC(UTCYear, UTCMonth, UTCDate, 0, 0, 0, 0);
    return todayStartTime;
};
exports.getTodayStartTime = getTodayStartTime;
const getNewMazeData = (maze) => {
    const { side, startYCoord, startXCoord, mazeData } = maze;
    const startYCoordIndex = Math.floor(startYCoord / 10);
    const startXCoordIndex = Math.floor(startXCoord / 10);
    const userMazeData = mazeData
        .split("")
        .map((room, index) => {
        for (let i = 0; i < 10; i++) {
            if (index >=
                startYCoordIndex * 10 * side + i * side + startXCoordIndex * 10 &&
                index <
                    startYCoordIndex * 10 * side +
                        i * side +
                        (startXCoordIndex + 1) * 10) {
                return room;
            }
        }
        return "z";
    })
        .join("");
    return userMazeData;
};
exports.getNewMazeData = getNewMazeData;
const updateMazeData = (userMazeData, fullMazeData, targetYCoord, targetXCoord) => {
    const targetYCoordIndex = Math.floor(targetYCoord / 10);
    const targetXCoordIndex = Math.floor(targetXCoord / 10);
    const side = Math.sqrt(userMazeData.length);
    const newUserMazeData = userMazeData
        .split("")
        .map((room, index) => {
        for (let i = 0; i < 10; i++) {
            if (index >=
                targetYCoordIndex * 10 * side + i * side + targetXCoordIndex * 10 &&
                index <
                    targetYCoordIndex * 10 * side +
                        i * side +
                        (targetXCoordIndex + 1) * 10) {
                return fullMazeData[index];
            }
        }
        return room;
    })
        .join("");
    return newUserMazeData;
};
exports.updateMazeData = updateMazeData;
