import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Creacion del app
const app = express();

// Conexión a MongoDB usando mongoose
mongoose
  .connect(
    'mongodb+srv://' +
      process.env.MONGO_USER +
      ':' +
      process.env.MONGO_PASS +
      '@proyecto1.szw21vh.mongodb.net',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected.');
  })
  .catch((err) => {
    console.log('There was an error with connection!');
    console.log(err);
  });

// Middlewares
app.use(cors());
app.use(express.json());

import usersRouter from "./src/users/users.router.js";
app.use("/users", usersRouter);
import productsRouter from "./src/productos/products.router.js";
app.use("/products", productsRouter);
import restaurantRouter from "./src/restaurantes/restaurant.router.js";
app.use("/restaurant", restaurantRouter);
import ordersrouter from "./src/pedidos/orders.router.js";
app.use("/orders", ordersrouter);



// Inicia app en puerto 8080
app.listen(8080);
