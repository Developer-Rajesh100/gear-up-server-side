const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
/* 
User : gearUpProduct
Password : w4LqHiIzjpWkfU5p
*/
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
    //DELEVER
    app.put("/product/:id", async (req, res) => {
      const deleverProduct = req.body.newQuentity;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      const option = { upsert: true };
      const updatePro = {
        $set: {
          ...product,
          quentity: deleverProduct,
        },
      };
      const result = await productCollection.updateOne(
        query,
        updatePro,
        Option
      );
      res.send(result);
    });
    // ADD QUENTITY
    app.put("/product/:id", async (req, tes) => {
      const deleverProduct = req.body.newQuentity;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      const option = { upsert: true };
      const updatePro = {
        $set: {
          ...product,
          quantity: deleverProduct,
        },
      };
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Server");
});
app.listen(port, () => {
  console.log("Server is running", port);
});
