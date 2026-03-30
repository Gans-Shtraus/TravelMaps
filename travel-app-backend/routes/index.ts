import express from "express";
import {
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} from "../controllers/cityController";
import {
  getLandmarksByCity,
  getLandmarkById,
  createLandmark,
  updateLandmark,
  deleteLandmark,
} from "../controllers/landmarkController";

const router = express.Router();

// Роуты для городов
router.get("/cities", getCities);
router.get("/cities/:id", getCityById);
router.post("/cities", createCity); // Создание города
router.put("/cities/:id", updateCity); // Обновление города
router.delete("/cities/:id", deleteCity); // Удаление города

// Роуты для достопримечательностей
router.get("/landmarks/city/:cityId", getLandmarksByCity);
router.get("/landmarks/:id", getLandmarkById);
router.post("/landmarks", createLandmark);
router.put("/landmarks/:id", updateLandmark);
router.delete("/landmarks/:id", deleteLandmark);

export default router;
