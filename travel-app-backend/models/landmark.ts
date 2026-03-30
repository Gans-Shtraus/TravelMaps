import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import City from "./city";

class Landmark extends Model {
  declare id: number;
  declare cityId: number;
  declare name: string;
  declare description: string;
  declare history: string;
  declare audioUrl: string | null;
  declare coordinates: string; // 'lat,lng'
  declare imageUrl: string | null;

  // Добавляем обязательные поля Sequelize
  declare createdAt: Date;
  declare updatedAt: Date;
}

Landmark.init(
  {
    cityId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    history: { type: DataTypes.TEXT, allowNull: true },
    audioUrl: { type: DataTypes.STRING, allowNull: true },
    coordinates: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
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
    modelName: "landmark",
    // Отключаем мягкое удаление
    paranoid: false,
  },
);

Landmark.belongsTo(City, { foreignKey: "cityId" });
City.hasMany(Landmark, { foreignKey: "cityId" });

export default Landmark;
