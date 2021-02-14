const express = require("express");
const mongoose = require("mongoose");
const pcGame = require("./models/pcGames");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
app.use(cors());
app.use(express.json());
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("db baglandı");
  }
);
// app.get("/updatealldata", async (req, res) => {
//   const data = await pcGame.updateMany({}, { viewCount:0});
//   res.send(data);
// });
// app.get("/api", async function (req, res) {
//   const data = await pcGame.find({});

//   res.json(data);
// });
// app.get("/count", async function (req, res) {
//   const data = await pcGame.countDocuments();
//   res.json({ count: data });
// });

// app.get("/api/singlegamebyid/:id", async function (req, res) {
//   const data = await pcGame.findById(req.params.id);
//   res.json(data);
// });

// --------------------------------------------------------------------------------------------------------------
app.get("/api/singlegamebyurl/:title", async function (req, res) {
  const data = await pcGame.find({ url: req.params.title });
  res.json(data);
});
app.get("/updateviewcount/:url", async (req, res) => {
  const data = await pcGame.findOne({ url: req.params.url });
  if (!data) {
    res.json({ success: false });
    return;
  }
  data.viewCount = data.viewCount + 1;
  await data.save();
  res.json(data);
});
app.get("/api/links", async function (req, res) {
  const data = await pcGame.find({}, { url: 1 });
  res.json(data);
});

app.post("/api/search", async function (req, res) {
  const { searchItem } = req.body;
  const data = await pcGame.find({
    title: { $regex: `${searchItem}`, $options: "i" },
  });
  res.send(data);
});

app.get("/randomsix", async (req, res) => {
  pcGame.findRandom({}, {}, { limit: 6 }, function (err, results) {
    if (!err) {
      res.json(results);
    }
  });
});

app.get("/pagination/lastadded/:start", async function (req, res) {
  const data = await pcGame
    .find({})
    .sort({ id: -1 })
    .collation({ locale: "en_US", numericOrdering: true })
    .skip(parseInt(req.params.start))
    .limit(8);
  res.json(data);
});
app.get("/pagination/mostviewed/:start", async function (req, res) {
  const data = await pcGame
    .find({})
    .sort({ viewCount: -1 })
    .skip(parseInt(req.params.start))
    .limit(8);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
