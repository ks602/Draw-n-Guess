const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session')({
  secret: "drawAndGuess",
  saveUninitialized: true,
  resave: false
});
const app = express();
const socket = require("socket.io");
const sharedsession = require("express-socket.io-session");

server = app.listen(9007, () => {
  console.log("Listening on port 9007!");
});

//init socket
const io = socket(server);

let userList = [];

//init body-parser
app.use(express.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

//init session
app.use(session);

//middlewares
app.use("/css", express.static(__dirname + "/client/css"));
app.use("/js", express.static(__dirname + "/client/js"));

app.get("/", (req, res) => {
  console.log(`Session User: ${req.session.user}`);
  if (req.session.user) {
    res.sendFile(__dirname + "/client/game.html");
  } else {
    res.sendFile(__dirname + "/client/index.html");
  }
});

app.post("/sendLogin", (req, res) => {
  let username = req.body["username"];
  if (userList.indexOf(username) == -1) {
    userList.push(username);
    req.session.user = username;
    res.json({
      status: true
    });
  } else
    res.json({
      status: false
    });
})

app.get("*", (req, res) => {
  res.status(404).sendFile(__dirname + "/client/404.html");
});

//Socket

io.sockets.on("connection", newConnection);
io.use(sharedsession(session, {
  autoSave: true
}));

function newConnection(connection) {
  console.log(connection.id);

  (function () {
    let data = {
      user: connection.handshake.session.user,
      userList
    }
    io.sockets.emit("join", data)
  })();

  connection.on("chat", (data) => {
    console.log(data);
    data.user = connection.handshake.session.user;
    connection.broadcast.emit("chat", data);
  });

  connection.on("disconnect", () => {
    console.log("Disconnect: " + connection.id);
  })
}