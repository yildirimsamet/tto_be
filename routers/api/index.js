const express = require("express");
const router = express.Router();
const pcGame = require("../../models/pcGames");

router.get("/singlegamebyurl/:title", async function (req, res) {
  const data = await pcGame.find({ url: req.params.title });
  res.json(data);
});
router.get("/updateviewcount/:url", async (req, res) => {
  const data = await pcGame.findOne({ url: req.params.url });
  if (!data) {
    res.json({ success: false });
    return;
  }
  data.viewCount = data.viewCount + 1;
  await data.save();
  res.json(data);
});
router.get("/links", async function (req, res) {
  const data = await pcGame.find({}, { url: 1 });
  res.json(data);
});
router.post("/search", async function (req, res) {
  const { searchItem } = req.body;
  const data = await pcGame.find({
    title: { $regex: `${searchItem}`, $options: "i" },
  });
  res.send(data);
});
router.get("/randomsix", async (req, res) => {
  pcGame.findRandom({}, {}, { limit: 6 }, function (err, results) {
    if (!err) {
      res.json(results);
    }
  });
});
router.get("/pagination/lastadded/:start", async function (req, res) {
  const data = await pcGame
    .find({})
    .sort({ id: -1 })
    .collation({ locale: "en_US", numericOrdering: true })
    .skip(parseInt(req.params.start))
    .limit(8);
  res.json(data);
});
router.get("/pagination/mostviewed/:start", async function (req, res) {
  const data = await pcGame
    .find({})
    .sort({ viewCount: -1 })
    .skip(parseInt(req.params.start))
    .limit(8);
  res.json(data);
});

module.exports = router;
