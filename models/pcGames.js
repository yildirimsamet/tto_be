const mongoose = require("mongoose");
const { Schema } = mongoose;
const PcGameSchema = new Schema({
  id: String,
  title: String,
  content: String,
  url: String,
  image: String,
  req: Object,
  creatorUrl: String,
  inGameImages: Object,
  downloadLink: String,
  size: String,
});

module.exports = mongoose.model("pcGame", PcGameSchema);
