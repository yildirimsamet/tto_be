const express = require("express");
const mongoose = require("mongoose");
const routers = require("./routers");
const cors = require("cors");
const dbConnect = require("./utils/dbConnect");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
app.use(cors());
app.use(express.json());

dbConnect();

app.use("/", routers);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
