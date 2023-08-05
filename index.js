const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const { DB_USERNAME, DB_PASS } = process.env;
const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASS}@cluster0.7vfzqgg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("next_pc_builder").collection("products");

    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send({ message: "success", status: 200, data: products });
    });

    app.get("/products/:id", async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const product = await productCollection.findOne({ _id: id });
      res.status(200).send(product);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
