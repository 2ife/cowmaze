import Sequelize, {
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

class Maze extends Model<InferAttributes<Maze>, InferCreationAttributes<Maze>> {
  declare id: CreationOptional<number>;
  declare level: number;
  declare side: number;
  declare startYCoord: number;
  declare startXCoord: number;
  declare destinationYCoord: number;
  declare destinationXCoord: number;
  declare mazeData: string;

  static initiate(sequelize: Sequelize.Sequelize) {
    Maze.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        level: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        side: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        startYCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        startXCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        destinationYCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        destinationXCoord: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        mazeData: {
          type: Sequelize.TEXT("medium"),
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Maze",
        tableName: "mazes",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate() {}
}
export default Maze;
