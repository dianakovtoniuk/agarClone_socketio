
// player.locX = Math.floor(500 * Math.random() + 10); // horizontal axis
// player.locY = Math.floor(500 * Math.random() + 10); // vertical axis

//==========================
//===========DRAW===========
//==========================
const draw = ()=>{

    //reset the context traslate back to default
    context.setTransform(1,0,0,1,0,0);

    //clearRect clears out the canvas, so we can draw on a clean canvas next frame/draw()
    context.clearRect(0,0,canvas.width,canvas.height)

    //clamp the screen/vp to the players location (x,y)
    const camX = -player.locX + canvas.width/2
    const camY = -player.locY + canvas.height/2

    //translate moves the cavnas/context to where the player is at
    context.translate(camX,camY)


    //draw all the players
    players.forEach(p=>{
        if(!p.playerData){
            //if the playerData doesn't exist, this is an absobred player and we don't draw
            return 
        }
        context.beginPath()
        context.fillStyle = p.playerData.color;
        context.arc(p.playerData.locX,p.playerData.locY,p.playerData.radius,0,Math.PI*2) //draw an arc/circle
        // context.arc(200,200,10,0,Math.PI*2) //draw an arc/circle
        //arg1 and arg2 are center x and centery of the arc
        //arg3 = radius of the circle
        //arg4 = where to start drawing in radians - 0 = 3:00
        //arg 5 = where to stop drawing in radians - Pi = 90deg
        context.fill();
        context.lineWidth = 3; //how wide to draw a line in pixels
        context.strokeStyle = 'rgb(0,255,0)' // draw a green line
        context.stroke() //draw the line (border)
    }) 

    //draw all the orbs
    orbs.forEach(orb=>{
        context.beginPath(); //this will start a new path
        context.fillStyle = orb.color
        context.arc(orb.locX,orb.locY,orb.radius,0,Math.PI*2);
        context.fill();
    })

    // requestAnimationFrame is like a controlled loop
    // it runs recursively, every paint/frame. If the framerate is 35 fps
    requestAnimationFrame(draw); 
}
