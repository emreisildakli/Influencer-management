require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const influencerRoutes = require("./influencerRoutes");
var cors = require("cors");

const app = express();

const clientOptions = { serverApi: { version: "1", strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version

    await mongoose.connect(process.env.DB_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });

    app.listen(PORT, () => {
      console.log("App listening");
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}

run().catch(console.dir);

const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use("/", influencerRoutes);
