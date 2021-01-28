const express = require("express");
const mongoose = require("mongoose");
const pcGame = require("./models/pcGames");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
app.use(express.json());
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("db baglandı");
  }
);

app.get("/api", async function (req, res) {
  const data = await pcGame.find({});

  res.json(data);
});
app.get("/count", async function (req, res) {
  const data = await pcGame.countDocuments();
  res.json({ count: data });
});
app.get("/pagination/:start", async function (req, res) {
  const data = await pcGame.find({}).skip(parseInt(req.params.start)).limit(8);
  res.json(data);
});
app.get("/api/links", async function (req, res) {
  const data = await pcGame.find({}, { url: 1 });
  res.json(data);
});
app.get("/api/singlegamebyid/:id", async function (req, res) {
  const data = await pcGame.findById(req.params.id);
  res.json(data);
});
app.post("/api/search", async function (req, res) {
  const searchItem = req.body.search.toLowerCase();
  const data = await pcGame.find({
    title: { $regex: `${searchItem}`, $options: "i" },
  });
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
