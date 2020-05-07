let express = require("express");
let app = express();

app.use(express.static(__dirname + "/client"));

app.listen(9001, () => {
  console.log("Listening on port 9001!");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.get("/game", (req, res) => {
  res.sendFile(__dirname + "/client/game.html");
});

app.get("*", (req, res) => {
  res.sendFiLe(__dirname + "/client/404.html");
});