var Entity = require('../entity');

function VO() {
    this.ID = 3;
    this.name = "Virus Off";
    this.decayMod = 1.0; // Modifier for decay rate (Multiplier)
    this.packetLB = 49; // Packet id for leaderboard packet (48 = Text List, 49 = List, 50 = Pie chart)
    this.haveTeams = false; // True = gamemode uses teams, false = gamemode doesnt use teams

    this.specByLeaderboard = false; // false = spectate from player list instead of leaderboard
}

module.exports = VO;

// Override these

VO.prototype.onServerInit = function(gameServer) {
    // Called when the server starts
    gameServer.run = true;
};

VO.prototype.onTick = function(gameServer) {
    // Called on every game tick 
};

VO.prototype.onChange = function(gameServer) {
    // Called when someone changes the gamemode via console commands
};

VO.prototype.onPlayerInit = function(player) {
    // Called after a player object is constructed
};

VO.prototype.onPlayerSpawn = function(gameServer,player) {
    // Called when a player is spawned
    player.color = gameServer.getRandomColor(); // Random color
    gameServer.spawnPlayer(player);
};

VO.prototype.pressQ = function(gameServer,player) {
    // Called when the Q key is pressed
    if (player.spectate) {
        gameServer.switchSpectator(player);
    }
};

VO.prototype.pressW = function(gameServer,player) {
    // Called when the W key is pressed
    //var newVirus = new Entity.Virus(this.getNextNodeId(), null, player.position(), 30);
    //newVirus.setAngle(player.getAngle());
    //newVirus.setMoveEngineData(200, 20);
    //this.addNode(newVirus);
    //this.setAsMovingNode(newVirus);
    //gameServer.ejectMass(player);
    var client = player;
for (var i = 0; i < client.cells.length; i++) {
        var cell = client.cells[i];

        if (!cell) {
            continue;
        }

        if (cell.mass < 32) {
            continue;
        }

        var deltaY = client.mouse.y - cell.position.y;
        var deltaX = client.mouse.x - cell.position.x;
        var angle = Math.atan2(deltaX,deltaY);

        // Get starting position
        var size = cell.getSize() + 5;
        var startPos = {
            x: cell.position.x + ( (size + 15) * Math.sin(angle) ),
            y: cell.position.y + ( (size + 15) * Math.cos(angle) )
        };

        // Remove mass from parent cell
        cell.mass -= 30
        // Randomize angle
        angle += (Math.random() * .4) - .2;

        // Create cell
        var ejected = new Entity.Virus(gameServer.getNextNodeId(), null, startPos, 15);
        ejected.setAngle(angle);
        ejected.setMoveEngineData(160, 20);

        gameServer.addNode(ejected);
        gameServer.setAsMovingNode(ejected);
};
};

VO.prototype.pressSpace = function(gameServer,player) {
    // Called when the Space bar is pressed
    gameServer.splitCells(player);
};

VO.prototype.onCellAdd = function(cell) {
    // Called when a player cell is added
};

VO.prototype.onCellRemove = function(cell) {
    // Called when a player cell is removed
};

VO.prototype.onCellMove = function(x1,y1,cell) {
    // Called when a player cell is moved
};

VO.prototype.updateLB = function(gameServer) {
    // Called when the leaderboard update function is called
};
