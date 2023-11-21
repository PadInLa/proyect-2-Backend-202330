const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: [true] },
    restaurantID: { type: String, required: [true] },
    desc: { type: String },
    category: { type: String, required: [true] },
    price: { type: Number, required: [true] },
    isDisable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("products", productSchema);
