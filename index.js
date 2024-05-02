const express = require('express');
var app = express();
const mongoose = require("mongoose");
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
var PORT = 8001;
app.get('/',(req,res)=>{
    
    console.log("Connected to frontend");
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

const userSchema = mongoose.Schema({
    name : String,
    message : String
  })
////

mongoose.connect("mongodb://127.0.0.1:27017/config");
const User = mongoose.model('users', userSchema);

async function insert(_name, _message){
    console.log("data is inserting !!");
    await User.create({
      name : _name,
      message : _message
    })
  }


var datalist;
io.on('connection', (socket)=>{
    User.find().then((result)=>{
        datalist = result;
        console.log(datalist);
    })
    var name;
    console.log("socket Connected");
    socket.on('getName', (data)=>{
        io.sockets.emit('getprev',datalist);
        console.log(data);
        name = data;
    })
    
    socket.on('message', (data)=>{
        var msg = { nm : name, ms:  data};
        io.sockets.emit('sToc',msg);
        console.log(msg);
        insert(name,data);
    })
    socket.on('disconnect',()=>{
        console.log('Client Disconnected'); 
    });
})

http.listen(PORT, ()=>{
    console.log(`server Started on http://localhost:${PORT}`)
})

