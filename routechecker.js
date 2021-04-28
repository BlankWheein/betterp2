const express = require('express');
const fetch = require("node-fetch");
const fs = require("fs")
const http = require('http');
var https = require('https')
require("dotenv").config()

const app = express();
port = process.env.PORT | 80;

app.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: "5mb" }));


app.use("/kage", (req, res) => {
    let body = req.body;
})

function checker() {
    
}