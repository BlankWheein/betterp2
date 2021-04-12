const express = require('express')
const router = express.Router();
const bodyParser = require("body-parser");
const { json } = require('express');
const fs = require('fs');
router.use(bodyParser.urlencoded({
    extended: true
}));
const app = express()
const port = process.env.port || 3000;
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: "5mb" }));

router.get("/", (req, res) => {
  res.render("index");
});
app.listen(port, "0.0.0.0", () => console.log(`Listening at ${port}`))

