const IPFS = require("ipfs");
var express = require("express");
var Twitter = require("twitter");
var cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json({ limit: "50mb" }));

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.get("/", (req, res) => {
  res.json("Welcome!");
});

app.get("/users/:name", (req, res) => {
  client.get("users/search", { q: req.params.name }, function(
    error,
    tweets,
    response
  ) {
    if (error) throw error;
    res.json(tweets); // The favorites. // Raw response object.
  });
});

app.post("/images", async (req, res) => {
  var { path, content } = req.body;

  const node = await IPFS.create();
  const version = await node.version();
  const online = await node.isOnline();

  console.log("Version:", version.version);
  console.log("Is Ready:", online);
  console.log(content.data);

  const filesAdded = await node.add({
    path: path,
    content: content.data
  });

  await node.stop();

  res.send(filesAdded[0]);
});

app.listen(process.env.PORT || 3000, () => console.log("Listening..."));
