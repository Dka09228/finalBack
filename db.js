const Mongoose = require("mongoose");

const clusDB = `mongodb+srv://kurmetdosmagambetov2004:Kurmet2004@clusterapi.bdtmtgk.mongodb.net/API-CRUD`;

const connectDB = async () => {
  await Mongoose.connect(clusDB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;