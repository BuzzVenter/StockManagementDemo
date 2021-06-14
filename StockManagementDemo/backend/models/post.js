const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  regNo: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  modelYear: { type: Date, required: true },
  kms: { type: Number, required: true },
  colour: { type: String, required: true },
  vin: { type: String, required: true },
  retailPrice: { type: String, required: true },
  costPrice: { type: String, required: true },
  accessories: { type: Array, contentType: String, required: true },
  DTCreated: { type: Date, default: Date.now },
  DTUpdated: { type: Date, default: Date.now },
  imagePath: { type: Buffer, contentType: String , required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema);
