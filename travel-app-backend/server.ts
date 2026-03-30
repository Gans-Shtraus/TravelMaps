import express from "express";
import cors from "cors";
import cityRoutes from "./routes/index";
import 'dotenv/config';

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Будьте осторожны в продакшене!


const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, origin?: boolean) => void,
    ) => {
      // Разрешаем запросы без origin (Postman, curl и т. д.)
      if (!origin) return callback(null, true);

      const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Разрешаем запрос
      } else {
        callback(new Error("Not allowed by CORS"), false); // Запрещаем запрос
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use("/api", cityRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
