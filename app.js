import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:admin123@backend.huc8vbv.mongodb.net/?retryWrites=true&w=majority",
    {
      dbName: "backend",
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
    }
  )
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log(err);
  });

// Middlewares
app.use(cors());

import usersRouter from "./src/users/users.router.js";
app.use("/users", usersRouter);
import productsRouter from "./src/productos/products.router.js";
app.use("/products", productsRouter);
import restaurantRouter from "./src/restaurantes/restaurant.router.js";
app.use("/restaurant", restaurantRouter);
import ordersrouter from "./src/pedidos/orders.router.js";
app.use("/orders", ordersrouter);

export default app;
