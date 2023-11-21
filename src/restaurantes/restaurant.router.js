import {
  DeleteRestaurant,
  UpdateRestaurant,
  createRestaurant,
  getRestaurant,
  getRestaurants,
} from "./restaurant.controller";
import { Router } from "express";
const router = Router();

// Endpoint GET
router.get("/", getRestaurants);
router.get("/:id", getRestaurant);

// Endpoint POST
router.post("/", createRestaurant);

// Endpoint PATCH
router.patch("/:id", UpdateRestaurant);

// Endpoint DELETE
router.delete("/:id", DeleteRestaurant);

export default router;
