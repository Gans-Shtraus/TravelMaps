"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "cities",
      [
        {
          name: "Москва",
          coordinates: "55.7558,37.6173",
          zoomLevel: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Санкт-Петербург",
          coordinates: "59.9343,30.3351",
          zoomLevel: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Казань",
          coordinates: "55.7963,49.1089",
          zoomLevel: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Нижний Новгород",
          coordinates: "56.3287,44.0021",
          zoomLevel: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Екатеринбург",
          coordinates: "56.8389,60.6057",
          zoomLevel: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cities", null, {});
  },
};
