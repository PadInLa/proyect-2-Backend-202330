const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema(
  {
    name: { type: String, required: [true] },
    address: { type: String, required: [true] },
    category: {
      type: [String],
      validate: {
        validator: function (array) {
          return array && array.length > 0;
        },
        message: "Debe haber al menos una categoria...",
      },
    },
    isDisable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("restaurants", restaurantSchema);
