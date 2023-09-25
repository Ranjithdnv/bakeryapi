const mongoose = require("mongoose");

const NumberSchema = new mongoose.Schema(
  {
    dayofarrival: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Number", NumberSchema);
