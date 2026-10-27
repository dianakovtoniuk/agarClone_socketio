const checkForOrbCollisions = (pData,pConfig, orbs, settings)=>{
    //ORB COLLISIONS
    for (let i = 0; i < orbs.length; i++){
        const orb = orbs[i];
    // AABB Test(square)  - Axis-aligned bounding boxes
        if(pData.locX + pData.radius + orb.radius > orb.locX 
            && pData.locX < orb.locX + pData.radius + orb.radius
            && pData.locY + pData.radius + orb.radius > orb.locY 
            && pData.locY < orb.locY + pData.radius + orb.radius){
        // Pythagoras test(circle)
            distance = Math.sqrt(
                ((pData.locX - orb.locX) * (pData.locX - orb.locX)) + 
                ((pData.locY - orb.locY) * (pData.locY - orb.locY))	
                );
            if(distance < pData.radius + orb.radius){
        //COLLISION!!!
                pData.score += 1; //incrament score
                pData.orbsAbsorbed += 1; //incrament orbs absorbed count
                // pData.color = orb.color;
                if(pConfig.zoom > 1){
                    pConfig.zoom -= .001; //update zoom so player doesn't get to big for screen
                }
                pData.radius += 0.05; //increase player size
                if(pConfig.speed < -0.005){
                    pConfig.speed += 0.005; //increase player speed
                }else if(pConfig.speed > 0.005){
                    pConfig.speed -= 0.005;
                }
                // can't hit more than one orb on a tock so break and return
                return i;
                break;
            }
        }
    };
    return null
}

module.exports = {checkForOrbCollisions}
