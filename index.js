const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Club Bistro Running");
});

const uri = `mongodb+srv://${process.env.DB_KEY}:${process.env.DB_PASS}@clusterbase.o3yqpur.mongodb.net/?retryWrites=true&w=majority&appName=Clusterbase`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const menuCollection = client.db("BistroDB").collection("menu");
    const reviewCollection = client.db("BistroDB").collection("reviews");
    const cartCollection = client.db("BistroDB").collection("carts");

    // MENU COLLECTION //
    // find menu
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    // find reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // CARTS COLLECTION //
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Club Bistro Port: ${port}`);
});
