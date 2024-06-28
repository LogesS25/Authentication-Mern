const express = require('express');
const mongoose = require('mongoose');
const routes = require('./router');

const app = express();

app.use(express.json())
app.use('/api',routes)

//connection to mongoose
mongoose.connect('mongodb+srv://sivalog25:system@mernauth.3victko.mongodb.net/?retryWrites=true&w=majority&appName=MernAuth',{
   useNewUrlParser:true,
   useUnifiedTopology:true, 
})

const database = mongoose.connection

database.on('error',(err)=>console.log(err))

database.on("connected",()=>console.log('Database connected'))
app.listen(3000, ()=>{
    console.log("server started on localhost:3000");
})