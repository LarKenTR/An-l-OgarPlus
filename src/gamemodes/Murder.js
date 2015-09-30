var FFA = require('./FFA') //Base Gamemode
var Entity = require('../entity'); //You can delete if your gamemode doesn't modify entities
var EntityVirus = new require('../entity/Virus.js');
var PlayerCell = new require('../entity/PlayerCell.js');

var onPlayerCellConsume = PlayerCell.prototype.onConsume;
function Murder() {
    FFA.apply(this, Array.prototype.slice.call(arguments)); // Delete if you're not using a base gamemode (recommended to use one)
    
    this.ID = 18; // Change the -1 to what number must be inserted into the config. Example: this.ID = 7;
    this.name = "Murder"; // Put the gamemode name inside of the ""
    this.decayMod = 1.0; // Modifier for decay rate (Multiplier)
    this.packetLB = 49; // Packet id for leaderboard packet (48 = Text List, 49 = List, 50 = Pie chart)
    this.haveTeams = false; // True = gamemode uses teams, false = gamemode doesnt use teams

    this.specByLeaderboard = true; // false = spectate from player list instead of leaderboard
	
	//GAMEMODE DATA
	
	this.gamestep = 0;
	this.gamecountdown = 0;
	this.prevdeadlyvirus = [];
	this.players = [];
	this.showplayerlength = false;
	this.murderer = {
		name: "",
		id: 0,
		randomed: false
	}
}

module.exports = Murder; // Remove the <> and make sure to not put the .js at the end
Murder.prototype = new FFA(); // Change if you want to use a different Base gamemode, or delete this line if you don't want a base gamemode (advanced users)

var removeprevdv = false;
var countdowntick = 0;
var resetboard = false;
var sectick = 10;
var murderer = true;

Murder.prototype.onTick = function(gameServer) {
    if(removeprevdv){
		removeprevdv = false;
		for(var i = 0;i<this.prevdeadlyvirus.length;i++){
			gameServer.removeNode(this.prevdeadlyvirus[i]);
		}
		this.prevdeadlyvirus = [];
	}
	
	sectick--;
	if(sectick <= 0){
		sectick = 10;
		//call every 0.5 second
		
		//REMOVE DEAD PLAYER
		for(var i = 0;i<this.players.length;i++){
			var client = this.players[i];
			if(!(client.spectate ? false : (client.cells.length > 0 ? true : false))){
				this.players.splice(this.players.indexOf(this.players[i]),1);
			}
		}
		if(this.showplayerlength){
			var lb = [];
			lb.push("Player left :");
			lb.push(this.players.length + "");
			gameServer.SetLeaderboard(lb);
		}
		
		try{
			if(this.gamestep == 4){
				if(this.players.length == 1){
					var murc = 0;
					for(var i = 0;i<this.players.length;i++){
						if(this.players[i].Murderer){
							murc++;
						}
					}
					if(murc > 0){
						this.onGameEnd(gameServer,0);
					}
				}
				else if(this.players.length < 1){
					//NO ONE WIN
					//GAME END WITH UNKNOWN REASON
					this.onGameEnd(gameServer,2);
				}
			}
		}
		catch(Exception){}
	}
	
	if(resetboard){
		resetboard = false;
		gameServer.ResetLeaderboard();
	}
	
	if(this.gamestep == 1){
	this.gamestep = 2;
	countdowntick = 0;
	//WHEN GAME START COUNTDOWN
	
	}
	else if(this.gamestep == 2){
		if(countdowntick < 20){
			countdowntick++;
		}
		else{
			countdowntick = 1;
			this.gamecountdown--;
			//DISPLAY HERE
			var lb = [];
			lb.push("Game start in");
			lb.push(this.gamecountdown + " second");
			if(this.gamecountdown <= 10){
				if(!this.murderer.randomed){
					for(var i = 0;i<this.players.length;i++){
						var player = this.players[i];
						player.originame = player.name;
						player.name = "" + (Math.round(Math.random() * 6000));
					}
					//RANDOM PLAYER
					while(true){
						for(var i = 0;i<this.players.length;i++){
							var player = this.players[i];
							if((Math.random() * this.players.length * 2) < 2){
								player.Murderer = true;
								this.murderer.name = player.originame;
								this.murderer.id = player.pID;
								this.murderer.fn = player.name;
								this.murderer.randomed = true;
								break;
							}						
						}
						if(this.murderer.randomed) break;
					}
				}
				
				lb.push("===============");
				lb.push(this.murderer.fn);
				lb.push("is the murderer!");
				lb.push("===============");
				lb.push("Murderer :");
				lb.push("W : random name");
				lb.push("SPACE : shoot");
				lb.push("===============");
			}
			
			gameServer.SetLeaderboard(lb);
			
			if(this.gamecountdown == 0){
				this.gamestep = 3;
				this.murderer.randomed = false;
			}
		}
	}
	else if(this.gamestep == 3){
		for(var i = 0;i<this.players.length;i++){
			var player = this.players[i];
			player.name = player.originame;
			player.originame = null;
		}
		
		gameServer.ResetLeaderboard();
		
		for(var i = 0;i<this.players.length;i++){
			resetSpeed(gameServer,this.players[i]);
			MassPlayerTemplate(gameServer,this.players[i].pID,100 + (Math.random() * 60) - 30);
		}
		this.showplayerlength = true;
		this.gamestep = 4;
	}
	else if (this.gamestep == 4){
		//when game started
		
	}
	else if(this.gamestep == 5){
		this.gamestep = 0;
		this.showplayerlength = false;
	}
};

Murder.prototype.onGameEnd = function(gameServer,endcode,killer){
	//EC 0 = mur , 1 = bys , 2 = none , 3 = timelimited
	var lb = [];
	switch(endcode){
		case 0:
			lb.push("Murderer Win!");
			lb.push("===============");
			lb.push(this.murderer.name);	
			lb.push("is the murderer");
			lb.push("===============");
			lb.push("murderer kill");
			lb.push("everyone!");
		break;
		
		case 1:
			lb.push("Bystander Win!");
			lb.push("===============");
			lb.push(this.murderer.name);	
			lb.push("is the murderer");
			lb.push("===============");
			lb.push(killer.name);
			lb.push("killed murderer");		
		break;
		
		case 2:
			lb.push("NO ONE WIN!");
			lb.push("===============");
			lb.push(this.murderer.name);	
			lb.push("is the murderer");
			lb.push("===============");	
		break;
		
		case 3:
			lb.push("TIME LIMITED!");
			lb.push("===============");
			lb.push(this.murderer.name);	
			lb.push("is the murderer");
			lb.push("===============");			
		break;
	}
	
	gameServer.SetLeaderboard(lb);
		
	this.murderer = [];
	this.murderer.randomed = false;
	for(var i = 0;i<this.players.length;i++){
		this.players[i].Murderer = false;
		KillPlayerTemplate(gameServer,this.players[i].pID);
	}
	this.players = [];
	this.gamestep = 5;
	setTimeout(function(){
		resetboard = true;
	},10000);
}

Murder.prototype.onServerInit = function(gameServer) {
    // Called when the server starts
    gameServer.run = true;
	this.gamestep = 0;
	//RE-PROGRAM PLAYER CONSUMING
	
	PlayerCell.prototype.onConsume = function(consumer,gameServer){
		consumer.addMass(this.mass);
		
		gameServer.gameMode.onPlayerConsuming(gameServer,consumer.owner,this.owner);
		var mcheck = true;
		var vcheck = false;
		if(!isNaN(consumer.owner.Murderer)){
			if(consumer.owner.Murderer){
				mcheck = false;	
				//WHEN MURDERER EAT SOMEONE				
				//NOTHING TO DO
			}
		}		
		if(mcheck){
			if(!isNaN(this.owner.Murderer)){
				if(this.owner.Murderer){
					//WHEN SOMEONE EAT MURDERER
					gameServer.gameMode.onMurdererDied(gameServer,consumer.owner,this.owner);
				}
			}
		}
	}
};

Murder.prototype.pressW = function(gameServer,player) {
    // Called when the W key is pressed
    if(player.Murderer){
        //When player is murderer
        if(isNaN(player.renamecooldown)){
            player.renamecooldown = false;
        }
        if(player.renamecooldown == false){
            RandomName(player);
			this.murderer.name = player.name;
            player.renamecooldown = true;
            setTimeout(function(){
                player.renamecooldown = false;
            },30000);
        }
    }
    else{
        //When player not murderer
        gameServer.ejectMass(player);
    }
};

Murder.prototype.onPlayerSpawn = function(gameServer,player) {
    // Called when a player is spawned
	if(this.gamestep!=3){
		player.color = gameServer.getRandomColor()
		RandomName(player);
		gameServer.spawnPlayer(player);
		setSpeed(gameServer,player,0);
		this.players.push(player);
		if(this.players.length > (gameServer.config.MurderMinPlayer - 1)){
			this.gamestep = 1;
			this.gamecountdown = gameServer.config.MurderCooldown;
		}
	}
};

Murder.prototype.onMurdererDied = function(gameServer,killer,murderer){
	//NOT REALLY DIED , JUST SOMEONE EAT MURDERER
	//KILL MURDERER
	KillPlayerTemplate(gameServer,murderer.pID);
	//DISPLAY
	this.onGameEnd(gameServer,1,killer);
}

Murder.prototype.onPlayerConsuming = function(gameServer,consumer,victim){
	if(!victim.Murderer){
		if(!consumer.Murderer){
			//WHEN PLAYER EAT PLAYER
			if(consumer.pID != victim.pID){
				MassPlayerTemplate(gameServer,consumer.pID,20);
				KillPlayerTemplate(gameServer,victim.pID);
				var lb = [];
				lb.push(consumer.name);
				lb.push("eat an innocent");
				lb.push("player!");
				gameServer.SetLeaderboard(lb);
				setTimeout(function(){
					resetboard = true;
				},5000);
			}
		}
		else{
			//WHEN MURDERER EAT PLAYER
		}
	}
}

Murder.prototype.pressSpace = function(gameServer,player) {
    // Called when the Space bar is pressed
    if(player.Murderer){
        this.ShootVirus(gameServer,player);
    }
    else{
        gameServer.splitCells(player);
    }
};

Murder.prototype.onChange = function(gameServer) {
    // Called when someone changes the gamemode via console commands
	PlayerCell.prototype.onConsume = onPlayerCellConsume;
};

var RandomName = function(player){
    var skinno = 0;
    try{
        skinno = Math.round(Math.random() * skins.length);
    }
    catch(Exception){}
    player.name = skins[skinno]; //Random Name
}

Murder.prototype.ShootVirus = function(gameServer,player){
	if(isNaN(player.shootcooldown)){
		player.shootcooldown = false;
	}
	if(player.shootcooldown == false){
		player.shootcooldown = true;
		for (var i = 0; i < player.cells.length; i++) {
			var cell = player.cells[i];
		
			if (!cell) {
				continue;
			}

			if (cell.mass < 50) {
				continue;
			}

			var deltaY = player.mouse.y - cell.position.y;
			var deltaX = player.mouse.x - cell.position.x;
			var angle = Math.atan2(deltaX,deltaY);
			var size = cell.getSize() + 5;
			var startPos = {
				x: cell.position.x + ( (size + 15) * Math.sin(angle) ),
				y: cell.position.y + ( (size + 15) * Math.cos(angle) )
			};
			cell.mass -= 50
			angle += (Math.random() * .4) - .2;
			var ejected = new deadlyVirus(gameServer.getNextNodeId(), null, startPos, 15);
			ejected.setAngle(angle);
			ejected.setMoveEngineData(40, 20);
			gameServer.addNode(ejected);
			gameServer.setAsMovingNode(ejected);
			this.prevdeadlyvirus.push(ejected);
		}
		setTimeout(function(){
			removeprevdv = true;
		},1000)
		setTimeout(function(){
			player.shootcooldown = false;
		},5000)
	}
}

var skins = ["Poland","Usa","China","Russia","Canada","Australia","Spain","Brazil",
"France","Sweden","Chaplin","North Korea","South Korea","Japan","United Kingdom",
"Earth","Greece","Latvia","Lithuania","Estonia","Finland","Norway","Cia","Maldivas","Nigeria"];

function deadlyVirus(){
	EntityVirus.apply(this, Array.prototype.slice.call(arguments));
    this.color = {r: 255, g: 255, b: 0};
}

deadlyVirus.prototype = new EntityVirus();

deadlyVirus.prototype.onConsume = function(consumer,gameServer) {
	var ismurderer = false;
	if(!isNaN(consumer.owner.Murderer)){
		if(consumer.owner.Murderer){
			ismurderer = true;
		}
	}
	if(!ismurderer){
		this.KillPlayer(gameServer,consumer.owner.pID);		
	}
}

deadlyVirus.prototype.KillPlayer = function(gameServer,id){
    for (var i in gameServer.clients) {
        if (gameServer.clients[i].playerTracker.pID == id) {
            var client = gameServer.clients[i].playerTracker;
            var len = client.cells.length;
            for (var j = 0; j < len; j++) {
                gameServer.removeNode(client.cells[0]);
            }
            break;
        }
    }
}

deadlyVirus.prototype.onRemove = function(gameServer){}

var KillPlayerTemplate = function(gameServer,id){
    for (var i in gameServer.clients) {
        if (gameServer.clients[i].playerTracker.pID == id) {
            var client = gameServer.clients[i].playerTracker;
            var len = client.cells.length;
            for (var j = 0; j < len; j++) {
                gameServer.removeNode(client.cells[0]);
            }
            break;
        }
    }
}

var MassPlayerTemplate = function(gameServer,id,tmass){
    for (var i in gameServer.clients) {
        if (gameServer.clients[i].playerTracker.pID == id) {
            var client = gameServer.clients[i].playerTracker;
            var len = client.cells.length;
            for (var j = 0; j < len; j++) {				
                    client.cells[j].mass = tmass;
            }
            break;
        }
    }
}

var setSpeed = function(gameServer,player,speed){
	for(var i = 0;i<player.cells.length;i++){
		//SET SPEED
		var cell = player.cells[i];
		cell.setSpeedNum = speed;
		cell.getSpeed = function(){
			return this.setSpeedNum;
		}
	}
}

var resetSpeed = function(gameServer,player){
	for(var i = 0;i<player.cells.length;i++){
		var cell = player.cells[i];
		//RESTORE
		cell.getSpeed = function() {
			return 30 * Math.pow(this.mass, -1.0 / 4.5) * 50 / 40;
		};
	}
}