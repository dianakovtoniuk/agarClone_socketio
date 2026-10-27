//Where all our socket stuff will go
const io = require('../servers').io;
//oh... we need express, get app, but only put what we need to inside of our socket stuff
const app = require('../servers').app;

//================CLASSES================
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const Orb = require('./classes/Orb');
//=======================================

//make an orbs array that will host all 500/5000 NOT PLAYER orbs.
//every time one is absorb, the server will make a new one
const orbs = [];
const settings = {
    defaultNumberOfOrbs: 5000, //number of orbs on the map
    defaultSpeed: 6, //player speed
    defaultSize: 6, //default player speed
    defaultZoom: 1.5, // as the player gets bigger, zoom needs to go out
    worldWidth: 5000,
    worldHeight: 5000,
    defaultGenericOrbSize: 5, //smaller than player orbs
}
const players = [];
const playersForUsers = [];
let tickTockInterval;

//on server start, to make our initial defaultNumberOfOrbs
initGame();
// console.log(orbs)

io.on('connect',(socket)=>{
    // a player has connected
    let player = {};
    socket.on('init',(playerObj,ackCallback)=>{

        if(players.length === 0){ //someone is about to be added to players. Start tick-tocking
            //tick-tock - issue an event to EVERY connected socket, that is playing the game, 30 times per second
            tickTockInterval = setInterval(()=>{
                io.to('game').emit('tick',playersForUsers) // send the event to the "game" room
            },33) //1000/30 = 33.33333, there are 33, 30's in 1000 milliseconds, 1/30th of a second, or 1 of 30fps 
        }
        
        socket.join('game'); //add this socket to "game" room
        //event that runs on join that does init game stuff
        // make a playerConfig object - the data specific to this player that only the player needs to know
        const playerName = playerObj.playerName;
        const playerConfig = new PlayerConfig(settings);
        const playerData = new PlayerData(playerName,settings)
        player = new Player(socket.id,playerConfig,playerData);
        players.push(player); //server use only
        playersForUsers.push({playerData})
        // make a playerData object - the data specific to this player that everyone needs to know
        // a master player object to house both    
        ackCallback({orbs,indexInPlayers:playersForUsers.length-1}) //send the orbs array back as an ack function!
    })

    socket.on('disconnect',(reason)=>{
        // console.log(reason)
        //loop through players and find the player with THIS players socketId
        //and splice that player out
        for(let i = 0; i < players.length; i++){
            if(players[i].socketId === player.socketId){
                //these are the droids we're looking for
                //splice the player out of the players AND playersForUsers
                players.splice(i,1,{})
                playersForUsers.splice(i,1,{})
                break;
            }
        }
        //check to see if players is empty. If so, stop "ticking"
        if(players.length === 0){
            clearInterval(tickTockInterval)
        }
    });
})

function initGame(){
    //loop defaultNumberOfOrbs times, and push a new Orb() onto our array
    for(let i = 0; i < settings.defaultNumberOfOrbs; i++){
        orbs.push(new Orb(settings));
    }
}
