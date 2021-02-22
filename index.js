const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const pcGame = require("./models/pcGames");
const User = require("./models/User");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
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

app.get("/", function (req, res) {
  res.send("Hello");
});

//Get data --------------------------------------------------------------------------------------------------------------
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
app.get("/api/oyunekle", async (req, res) => {
  const data = await pcGame.insertMany(newGames);
  res.json({ data });
});
//Get data end -------------------------------------------------------------------------------------------------------------------------------------------

//User -------------------------------------------------------------------------------------------------------------------------------
const userSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(6).required(),
});
app.post("/api/user/signup", async (req, res) => {
  const isEmailExist = await User.find({ email: req.body.email });
  if (isEmailExist.length > 0) {
    return res.json({
      success: false,
      reason: "Email'e ait bir kullanıcı zaten bulunmakta.",
    });
  }
  const valid = userSchema.validate(req.body);

  if (valid.error) {
    return res.json({ success: false, reason: valid.error.details[0].message });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  res.json({ success: true, data: newUser });
});

app.post("/api/user/signin", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({
      success: false,
      reason: "Email'e ait bir kullanıcı bulunamadı.",
    });
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordValid) {
    res.json({ success: false, reason: "Parolanız yanlış." });
  }
  const token = jwt.sign(
    { _id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET
  );
  res.json({ success: true, token });
});
//User end -------------------------------------------------------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
