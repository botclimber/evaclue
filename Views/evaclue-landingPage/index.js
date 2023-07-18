const express = require("express");
const path = require("path");

const app = express();

const port = process.env.PORT;

app.use(express.static(__dirname + "/static"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/static/index.html"));
});

app.listen(port, () => {
  console.log("Express server listening on port " + port)
})

