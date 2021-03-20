const mongoose = require("mongoose");
const dbConnect = () => {
  mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) throw err;
      console.log("db baglandı");
    }
  );
};
module.exports = dbConnect;
