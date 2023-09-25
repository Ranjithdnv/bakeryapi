const mongoose = require("mongoose");

const ItemsSchema = new mongoose.Schema(
  {
    item: { type: String },
    category: { type: String },
    cat: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Items", ItemsSchema);
