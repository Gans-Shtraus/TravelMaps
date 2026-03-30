"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("landmarks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      history: {
        type: Sequelize.TEXT,
      },
      audioUrl: {
        type: Sequelize.STRING,
      },
      coordinates: {
        type: Sequelize.STRING, // формат 'lat,lng'
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("landmarks");
  },
};
