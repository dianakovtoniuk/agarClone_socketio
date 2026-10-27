//Where all our socket stuff will go
const io = require('../servers').io;
//oh... we need express, get app, but only put what we need to inside of our socket stuff
const app = require('../servers').app;

io.on('connect',(socket)=>{
    console.log(socket.id,"has connected")
})
