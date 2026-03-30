import { Request, Response } from "express";
import City from "../models/city";

/**
 * Получить все города
 */
export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Создать город
 */
export const createCity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, coordinates, zoomLevel } = req.body;

    if (!name || !coordinates) {
      res.status(400).json({
        error: "Name and coordinates are required",
      });
      return;
    }

    const city = await City.create({ name, coordinates, zoomLevel });
    res.status(201).json(city);
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Обновить город по ID
 */
export const updateCity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cityId = req.params.id;
    const { name, coordinates, zoomLevel } = req.body;

    // Безопасная проверка и преобразование ID
    if (!cityId || Array.isArray(cityId) || typeof cityId !== "string") {
      res.status(400).json({ error: "Invalid city ID" });
      return;
    }

    const idToFind: number | string = isNaN(Number(cityId))
      ? cityId
      : Number(cityId);
    const city = await City.findByPk(idToFind);

    if (!city) {
      res.status(404).json({ error: "City not found" });
      return;
    }

    await city.update({ name, coordinates, zoomLevel });
    res.json(city);
  } catch (error) {
    console.error("Error updating city:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Удалить город по ID
 */
export const deleteCity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cityId = req.params.id;

    // Безопасная проверка и преобразование ID
    if (!cityId || Array.isArray(cityId) || typeof cityId !== "string") {
      res.status(400).json({ error: "Invalid city ID" });
      return;
    }

    const idToFind: number | string = isNaN(Number(cityId))
      ? cityId
      : Number(cityId);
    const city = await City.findByPk(idToFind);

    if (!city) {
      res.status(404).json({ error: "City not found" });
      return;
    }

    await city.destroy();
    res.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Получить город по ID
 */
export const getCityById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cityId = req.params.id;

    // Проверяем, что ID существует, это строка и не массив
    if (!cityId || Array.isArray(cityId) || typeof cityId !== "string") {
      res.status(400).json({ error: "Invalid city ID" });
      return;
    }

    const idToFind: number | string = isNaN(Number(cityId))
      ? cityId
      : Number(cityId);
    const city = await City.findByPk(idToFind);

    if (!city) {
      res.status(404).json({ error: "City not found" });
      return;
    }

    res.json(city);
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
