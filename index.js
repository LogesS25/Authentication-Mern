const express = require('express');
const mongoose = require('mongoose');
const routes = require('routes');

const app = express();

app.use(express.json())

app.listen(3000, ()=>{
    console.log("server started on localhost:3000");
})