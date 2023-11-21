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

import usersRouter from "./users/users.router";
app.use("/users", usersRouter);
import productsRouter from "./productos/products.router";
app.use("/products", productsRouter);
import restaurantRouter from "./restaurantes/restaurant.router";
app.use("/restaurant", restaurantRouter);
import ordersrouter from "./pedidos/orders.router";
app.use("/orders", ordersrouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found." });
});

try {
  app.listen(3012);
  console.log("Connection stablished.");
} catch (error) {
  console.log(error);
}
