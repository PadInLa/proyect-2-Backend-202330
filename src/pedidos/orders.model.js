const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    restaurantID: { type: String, required: [true] },
    userID: { type: String, required: [true] },
    status: {
      type: String,
      required: [true],
      default: "Creado",
      enum: [
        "Creado",
        "Enviado",
        "Aceptado",
        "Recibido",
        "On route",
        "Realizado",
      ],
    },
    isDisable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("orders", orderSchema);
