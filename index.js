const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(express.json());
const uri = `mongodb+srv://${process.env.GEAR_UP_USER}:${process.env.GEAR_UP_PASSWORD}@cluster0.e6a6c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("gearUp").collection("Product");
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });
    //POST
    app.post("/product", async (req, res) => {
      const addQuantity = req.body;
      const result = await productCollection.insertOne(addQuantity);
      res.send(result);
    });
    //DELETE
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //UPDATE

    app.put("/product/:productdetailsId", async (req, res) => {
      const id = req.params.productdetailsId;
      //console.log('empty', id);
      const addQuantity = req.body.stockQuantity;
      console.log(addQuantity);
      const filter = { _id: ObjectId(id) };
      const product = await productCollection.findOne(filter);
      const options = { upsert: true };
      console.log(addQuantity);
      const updateDoc = {
        $set: {
          ...product,
          quantity: addQuantity,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.put("/pd/:productdetailsId", async (req, res) => {
      const id = req.params.productdetailsId;
      //console.log('empty', id);
      const addQuantity = req.body.newQuantity;
      console.log(addQuantity);
      const filter = { _id: ObjectId(id) };
      const product = await productCollection.findOne(filter);
      const options = { upsert: true };
      console.log(addQuantity);
      const updateDoc = {
        $set: {
          ...product,
          quantity: addQuantity,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/gear", (req, res) => {
  res.send("Running is Server");
});
app.listen(port, () => {
  console.log("Server is running", port);
});
