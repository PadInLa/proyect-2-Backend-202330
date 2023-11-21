import {
  DeleteProduct,
  UpdateProduct,
  createProduct,
  getProduct,
  getproducts,
} from "./products.controller";
import { Router } from "express";
const router = Router();

// Endpoint GET
router.get("/", getproducts);
router.get("/:id", getProduct);

// Endpoint POST
router.post("/", createProduct);

// Endpoint PATCH
router.patch("/:id", UpdateProduct);

// Endpoint DELETE
router.delete("/:id", DeleteProduct);

export default router;
