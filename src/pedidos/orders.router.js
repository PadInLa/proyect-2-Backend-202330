import { Router } from "express";
import {
  DeleteOrder,
  UpdateOrder,
  createOrder,
  getOrder,
  getOrders,
  getOrderssended,
} from "./orders.controller";

const router = Router();
// Endpoint GET
router.get("/:id", getOrder);
router.get("/", getOrders);
router.get("/sended/", getOrderssended);
// Endpoint POST
router.post("/", createOrder);
// Endpoint PATCH
router.patch("/:id", UpdateOrder);
// Endpoint DELETE
router.delete("/:id", DeleteOrder);

export default router;
