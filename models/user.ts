import Sequelize, {
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare nick: string;
  declare loginId: string;
  declare password: string;
  declare loginCode: string | null;
  declare hp: CreationOptional<number>;
  declare potion: CreationOptional<number>;
  declare currentMazeLevel: CreationOptional<number>;
  declare currentMazeSide: number;
  declare currentMazeYCoord: CreationOptional<number>;
  declare currentMazeXCoord: CreationOptional<number>;
  declare currentMazeStartYCoord: number;
  declare currentMazeStartXCoord: number;
  declare currentMazeDestinationYCoord: number;
  declare currentMazeDestinationXCoord: number;
  declare currentMazeData: string;
  declare latestPotionReceiveTime: CreationOptional<number>;
  declare chargeCash: CreationOptional<number>;
  declare depositDeadLine: CreationOptional<number>;
  declare lockMemo: CreationOptional<string>;
  declare admin: CreationOptional<boolean>;
  declare inviteNumbers: CreationOptional<number>;
  declare inviterCode: string | null;

  static initiate(sequelize: Sequelize.Sequelize) {
    User.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nick: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        loginId: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        loginCode: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        hp: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 1000,
        },
        potion: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 10,
        },
        currentMazeLevel: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 1,
        },
        currentMazeSide: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        currentMazeYCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        currentMazeXCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        currentMazeStartYCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        currentMazeStartXCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        currentMazeDestinationYCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        currentMazeDestinationXCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        currentMazeData: {
          type: Sequelize.TEXT("medium"),
          allowNull: false,
        },
        latestPotionReceiveTime: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        chargeCash: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        depositDeadLine: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        lockMemo: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: "",
        },
        admin: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        inviteNumbers: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        inviterCode: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate() {}
}
export default User;
