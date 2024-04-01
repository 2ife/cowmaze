"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importStar(require("sequelize"));
class User extends sequelize_1.Model {
    static initiate(sequelize) {
        User.init({
            id: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nick: {
                type: sequelize_1.default.STRING(20),
                allowNull: false,
            },
            loginId: {
                type: sequelize_1.default.STRING(20),
                allowNull: false,
            },
            password: {
                type: sequelize_1.default.STRING(100),
                allowNull: false,
            },
            loginCode: {
                type: sequelize_1.default.STRING(100),
                allowNull: true,
            },
            hp: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1000,
            },
            potion: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 10,
            },
            currentMazeLevel: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1,
            },
            currentMazeSide: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            currentMazeYCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            currentMazeXCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            currentMazeStartYCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            currentMazeStartXCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            currentMazeDestinationYCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            currentMazeDestinationXCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            currentMazeData: {
                type: sequelize_1.default.TEXT("medium"),
                allowNull: false,
            },
            latestPotionReceiveTime: {
                type: sequelize_1.default.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            chargeCash: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            depositDeadLine: {
                type: sequelize_1.default.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            lockMemo: {
                type: sequelize_1.default.STRING(100),
                allowNull: false,
                defaultValue: "",
            },
            admin: {
                type: sequelize_1.default.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            inviteNumbers: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            inviterCode: {
                type: sequelize_1.default.STRING(20),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "User",
            tableName: "users",
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }
    static associate() { }
}
exports.default = User;
