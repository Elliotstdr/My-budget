import express from "express";
import cors from 'cors';
import { connectDB } from"./config/db";
import dotenv from "dotenv";
import { authRoutes } from './routes/auth.routes'
import { userRoutes } from "./routes/user.routes";
import { typeRoutes } from "./routes/type.routes";
import { operationRoutes } from "./routes/operation.routes";
import { fileRoutes } from "./routes/file.routes";
import { debtRoutes } from "./routes/debt.routes";

dotenv.config()
connectDB();

const app = express();

app.use(cors({origin: process.env.FRONTEND_URL}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/type", typeRoutes);
app.use("/operation", operationRoutes)
app.use("/file", fileRoutes)
app.use("/debt", debtRoutes)

app.listen(5001, () => console.log("Le serveur a démarré au port " + 5001)).setTimeout(5000);
