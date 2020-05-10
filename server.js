let express = require("express");
let bodyParser = require("body-parser");
let app = express();

app.use(express.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

app.use(express.static(__dirname + "/client"));
app.use("/css", express.static(__dirname + "client/css"));
app.use("/js", express.static(__dirname + "client/js"));

app.listen(9007, () => {
  console.log("Listening on port 9007!");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.post("/sendLogin", (req, res) => {
  console.log(req.body["username"]);
  res.json({
    status: false
  });
})

app.get("/game", (req, res) => {
  res.sendFile(__dirname + "/client/game.html");
});

app.get("*", (req, res) => {
  res.status(404).sendFile(__dirname + "/client/404.html");
});