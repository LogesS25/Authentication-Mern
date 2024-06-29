const express = require('express');
const mongoose = require('mongoose');
const routes = require('./router');
require('dotenv').config();

const app = express();

app.use(express.json())
app.use('/api',routes)

//connection to mongoose
mongoose.connect(process.env.DB_CONNECTION_STRING,{
   useNewUrlParser:true,
   useUnifiedTopology:true, 
})

const database = mongoose.connection

database.on('error',(err)=>console.log(err))

database.on("connected",()=> console.log('Database connected'))
app.listen(3000, ()=>{
    console.log("server started on localhost:3000");
})