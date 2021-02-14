const mongoose = require("mongoose");
const random = require("mongoose-simple-random");
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
  viewCount: { type: Number, default: 0 },
});
PcGameSchema.plugin(random);
module.exports = mongoose.model("pcGame", PcGameSchema);
