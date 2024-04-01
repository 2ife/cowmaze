import Sequelize from "sequelize";
import configObj from "../config/config";
import User from "./user";
import Maze from "./maze";

const env = (process.env.NODE_ENV as "production" | "test") || "development";
const config = configObj[env];

export const sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

User.initiate(sequelize);
Maze.initiate(sequelize);

User.associate();
Maze.associate();

export { User, Maze };
