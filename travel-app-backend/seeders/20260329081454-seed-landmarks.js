"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Получаем ID городов
    const cities = await queryInterface.sequelize.query(
      "SELECT id, name FROM cities",
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    const cityMap = {};
    cities.forEach((city) => {
      cityMap[city.name] = city.id;
    });

    await queryInterface.bulkInsert(
      "landmarks",
      [
        // Москва
        {
          cityId: cityMap["Москва"],
          name: "Красная площадь",
          description:
            "Главная площадь Москвы и России, исторический центр города",
          history:
            "Существовала уже в XV веке как место торговли. В 1493 году после пожара площадь была расчищена от деревянных построек...",
          audioUrl: "/audio/red-square.mp3",
          coordinates: "55.7539,37.6208",
          imageUrl: "/images/red-square.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cityId: cityMap["Москва"],
          name: "Храм Христа Спасителя",
          description: "Кафедральный собор Русской православной церкви",
          history:
            "Построен в XIX веке в память о войне 1812 года. Разрушен в 1931 году, восстановлен в 1990‑х...",
          audioUrl: "/audio/christ-saviour.mp3",
          coordinates: "55.7402,37.6056",
          imageUrl: "/images/christ-saviour.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Санкт‑Петербург
        {
          cityId: cityMap["Санкт-Петербург"],
          name: "Эрмитаж",
          description:
            "Один из крупнейших музеев мира с коллекцией более 3 млн произведений искусства",
          history: "Основан в 1764 году Екатериной II как частная коллекция...",
          audioUrl: "/audio/hermitage.mp3",
          coordinates: "59.9406,30.3149",
          imageUrl: "/images/hermitage.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cityId: cityMap["Санкт-Петербург"],
          name: "Петропавловская крепость",
          description: "Историческое ядро Санкт‑Петербурга",
          history:
            "Заложена в 1703 году Петром I. Служила крепостью, политической тюрьмой, усыпальницей российских императоров...",
          audioUrl: "/audio/peter-and-paul.mp3",
          coordinates: "59.9503,30.3166",
          imageUrl: "/images/peter-and-paul.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Казань
        {
          cityId: cityMap["Казань"],
          name: "Казанский Кремль",
          description:
            "Архитектурный ансамбль, объект Всемирного наследия ЮНЕСКО",
          history:
            "Формировался с X по XVI век. Включает памятники разных эпох и культур...",
          audioUrl: "/audio/kazan-kremlin.mp3",
          coordinates: "55.8008,49.1067",
          imageUrl: "/images/kazan-kremlin.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("landmarks", null, {});
  },
};
