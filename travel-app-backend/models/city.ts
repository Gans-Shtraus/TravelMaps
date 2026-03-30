import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class City extends Model {
  declare id: number;
  declare name: string;
  declare coordinates: string; // 'lat,lng'
  declare zoomLevel: number;

  // Добавляем обязательные поля Sequelize
  declare createdAt: Date;
  declare updatedAt: Date;
}

City.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    coordinates: { type: DataTypes.STRING, allowNull: false }, // '55.7558,37.6173'
    zoomLevel: { type: DataTypes.INTEGER, defaultValue: 12 },
    // Явно объявляем временные метки
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "city",
    // Отключаем мягкое удаление — убираем столбец deletedAt
    paranoid: false,
  },
);

export default City;
