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
class Maze extends sequelize_1.Model {
    static initiate(sequelize) {
        Maze.init({
            id: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            level: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            side: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            startYCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            startXCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            destinationYCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            destinationXCoord: {
                type: sequelize_1.default.INTEGER.UNSIGNED,
                allowNull: false,
            },
            mazeData: {
                type: sequelize_1.default.TEXT("medium"),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: "Maze",
            tableName: "mazes",
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }
    static associate() { }
}
exports.default = Maze;
