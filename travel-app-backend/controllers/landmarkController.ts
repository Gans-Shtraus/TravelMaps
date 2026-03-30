import { Request, Response } from "express";
import Landmark from "../models/landmark";
import City from "../models/city";

/**
 * Получить все достопримечательности города
 */
export const getLandmarksByCity = async (req: Request, res: Response) => {
  try {
    const cityIdParam = req.params.cityId;

    // Безопасное извлечение и проверка ID
    if (!cityIdParam || typeof cityIdParam !== "string") {
      return res.status(400).json({ error: "Некорректный ID города" });
    }

    const cityId = parseInt(cityIdParam, 10);
    if (isNaN(cityId)) {
      return res.status(400).json({ error: "Некорректный ID города" });
    }

    const landmarks = await Landmark.findAll({
      where: { cityId },
      attributes: ["id", "name", "coordinates", "imageUrl", "description"], // ДОБАВЛЕНО description
      include: [
        {
          model: City,
          attributes: ["name"],
          required: true,
        },
      ],
    });

    res.json(landmarks);
  } catch (error) {
    console.error("Ошибка получения достопримечательностей:", error);
    res.status(500).json({ error: "Ошибка загрузки достопримечательностей" });
  }
};

/**
 * Получить детальную информацию о достопримечательности
 */
export const getLandmarkById = async (req: Request, res: Response) => {
  try {
    const landmarkIdParam = req.params.id;

    if (!landmarkIdParam || typeof landmarkIdParam !== "string") {
      return res
        .status(400)
        .json({ error: "Некорректный ID достопримечательности" });
    }

    const landmarkId = parseInt(landmarkIdParam, 10);
    if (isNaN(landmarkId)) {
      return res
        .status(400)
        .json({ error: "Некорректный ID достопримечательности" });
    }

    const landmark = await Landmark.findByPk(landmarkId, {
      include: [
        {
          model: City,
          attributes: ["name"],
        },
      ],
    });

    if (!landmark) {
      return res
        .status(404)
        .json({ error: "Достопримечательность не найдена" });
    }

    res.json(landmark);
  } catch (error) {
    console.error("Ошибка получения достопримечательности:", error);
    res
      .status(500)
      .json({ error: "Ошибка загрузки данных достопримечательности" });
  }
};

/**
 * Создать новую достопримечательность
 */
export const createLandmark = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      history,
      audioUrl,
      coordinates,
      imageUrl,
      cityId,
    } = req.body;

    // Валидация обязательных полей
    if (!name || !coordinates || !cityId) {
      return res.status(400).json({
        error: "Обязательные поля: name, coordinates, cityId",
      });
    }

    const newLandmark = await Landmark.create({
      name,
      description,
      history,
      audioUrl,
      coordinates,
      imageUrl,
      cityId,
    });

    res.status(201).json(newLandmark);
  } catch (error) {
    console.error("Ошибка создания достопримечательности:", error);
    res.status(500).json({ error: "Ошибка создания достопримечательности" });
  }
};

/**
 * Обновить достопримечательность
 */
export const updateLandmark = async (req: Request, res: Response) => {
  try {
    const landmarkIdParam = req.params.id;

    if (!landmarkIdParam || typeof landmarkIdParam !== "string") {
      return res
        .status(400)
        .json({ error: "Некорректный ID достопримечательности" });
    }

    const landmarkId = parseInt(landmarkIdParam, 10);
    if (isNaN(landmarkId)) {
      return res
        .status(400)
        .json({ error: "Некорректный ID достопримечательности" });
    }

    const updates = req.body;
    const landmark = await Landmark.findByPk(landmarkId);

    if (!landmark) {
      return res
        .status(404)
        .json({ error: "Достопримечательность не найдена" });
    }

    await landmark.update(updates);
    res.json(landmark);
  } catch (error) {
    console.error("Ошибка обновления достопримечательности:", error);
    res.status(500).json({ error: "Ошибка обновления данных" });
  }
};

/**
 * Удалить достопримечательность
 */
export const deleteLandmark = async (req: Request, res: Response) => {
  try {
    const landmarkIdParam = req.params.id;

    if (!landmarkIdParam || typeof landmarkIdParam !== "string") {
      return res
        .status(400)
        .json({ error: "Некорректный ID достопримечательности" });
    }

    const landmarkId = parseInt(landmarkIdParam, 10);
    if (isNaN(landmarkId)) {
      return res
        .status(400)
        .json({ error: "Некорректный ID достопримечательности" });
    }

    const landmark = await Landmark.findByPk(landmarkId);

    if (!landmark) {
      return res
        .status(404)
        .json({ error: "Достопримечательность не найдена" });
    }

    await landmark.destroy();
    res.json({ message: "Достопримечательность удалена" });
  } catch (error) {
    console.error("Ошибка удаления достопримечательности:", error);
    res.status(500).json({ error: "Ошибка удаления" });
  }
};
