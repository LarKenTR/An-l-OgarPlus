var FFA = require('./FFA')
var Entity = require('../entity');
var CommandList = require('../modules/CommandList');

function FFATime() {
    FFA.apply(this, Array.prototype.slice.call(arguments));
	
    this.ID = 15;
    this.name = "FFATime";
    this.decayMod = 1.0;
    this.packetLB = 49;
    this.haveTeams = false;

    this.specByLeaderboard = true;
}
//TIME TO RESET (MILLISECOND)
var timems = 3600000;
//DO NOT TOUCH THIS
var MLP = true;
var RSG = false;

module.exports = FFATime;
FFATime.prototype = new FFA();

FFATime.prototype.onTick = function(gameServer) {
    // Called on every game tick 
	if(RSG == true){
		RSG = false;
		var execute = gameServer.commands['killall'];
		execute(gameServer,"");
	}
};

FFATime.prototype.onPlayerSpawn = function(gameServer,player) {
    // Called when a player is spawned
	//TO override onPlayerSpawn , Respawn command needed
    player.color = gameServer.getRandomColor();
    gameServer.spawnPlayer(player);
	//Start Timer
	if(MLP == true){
		MLP = false;
		ResetGame(gameServer)
	}
};
var ResetGame = function(gameServer){
	setTimeout(function() {
		//Call when end of the timer
		RSG = true;
		//Loop Resetting
		ResetGame(timems);
	}, timems);
}