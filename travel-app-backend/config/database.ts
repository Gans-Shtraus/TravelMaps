import dotenv from "dotenv";
import { Sequelize } from "sequelize";

require("dotenv").config();
console.log("DB_DIALECT:", process.env.DB_DIALECT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);

const {
  DB_HOST = "localhost",
  DB_PORT = 5432,
  DB_NAME = "travel_app",
  DB_USER = "postgres",
  DB_PASSWORD = "password",
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "postgres",
  logging: false, // отключить логирование SQL-запросов в продакшене
  define: {
    timestamps: true, // автоматически добавлять createdAt и updatedAt
    paranoid: true, // мягкая удаление (soft delete)
  },
});

// Проверка подключения к БД
sequelize
  .authenticate()
  .then(() => {
    console.log("Успешное подключение к базе данных");
  })
  .catch((error) => {
    console.error("Ошибка подключения к БД:", error);
  });

export default sequelize;
