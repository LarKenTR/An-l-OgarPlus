var GameMode = require('./gamemodes');
var Entity = require('./entity');
var PlayerTracker = require('./PlayerTracker');
var Commands = require('./modules/CommandList');
var net = require('net');

var	clientsRE = [];
var	configRE = {};
var RemotePort = 556;
var AuthVer = "AU02"
var AuthKey = "ABCD"
var GSCMD = "-";
var GSARG = "-";
var REAUTH = false;
var border;
var SVinfo = "";
var VirusInfo = "";
var virustick = 0;
var playertick = 0;
exports.Initreauth = function(Timer){
	REAUTH = true;
	setTimeout(function () {
		REAUTH = false;
	}, Timer)
}
exports.updateConfig = function(config){
	configRE = config;
}
exports.updateClients = function(clients){
	clientsRE = clients;
}
exports.GamemodeTick = function(gameServer){
	playertick++;
	if(playertick >= gameServer.config.MAPPlayerTick){
		playertick = 0;
		this.UpdatePlayers(gameServer);	
	}
}
exports.updateGameServer = function(gameServer){
	//Every 1 sec
	virustick++;
	if(virustick == 5){
		virustick = 0;
		this.UpdateViruses(gameServer);
	}
	this.GSExecute(gameServer);
	
}
//Update function
exports.UpdatePlayers = function(gameServer){
	//Update Player
	SVinfo = gameServer.gameMode.name + ";";
	SVinfo = SVinfo + process.memoryUsage().heapUsed/1000000 + ";";
	SVinfo = SVinfo + gameServer.clients.length + ";";
	//try{
		for (var i = 0; i < gameServer.clients.length; i++) {
			var client = gameServer.clients[i].playerTracker;
			SVinfo = SVinfo + client.pID + ";";
			SVinfo = SVinfo + (client.name == "" ? "An unnamed cell" : client.name) + ";";
			SVinfo = SVinfo + (client.spectate ? false : (client.cells.length > 0 ? true : false)) + ";";
			SVinfo = SVinfo + (typeof gameServer.clients[i].remoteAddress != 'undefined' ? gameServer.clients[i].remoteAddress : "BOT") + ";";
			SVinfo = SVinfo + client.getScore(true) + ";";
			SVinfo = SVinfo + client.centerPos.x + ";" + client.centerPos.y + ";";
			SVinfo = SVinfo + (client.spectate ? "0;0;0;" : (client.cells.length > 0 ? (client.getColor().red + ";" + client.getColor().green + ";" + client.getColor().blue + ";") : "0;0;0;"));
			SVinfo = SVinfo + client.cells.length + ";";
		}
	//}catch(Exception){}
	
	
	//DEBUG
	//console.log(SVinfo);
}
exports.UpdateViruses = function(gameServer){
	var len = gameServer.nodesVirus.length;
	VirusInfo = "";
    for (var i = 0;i < len;i++) {
        var virus = gameServer.nodesVirus[i];
		VirusInfo = VirusInfo + virus.position.x + ";";
		VirusInfo = VirusInfo + virus.position.y + ";";
	}
}
exports.GSExecute = function(gameServer){
	if(GSCMD != "-"){
		switch(GSCMD){
				
			//parseInt("12345")
			
			case "SVTICK":
			gameServer.config.MAPPlayerTick = parseInt(GSARG);
			break;
			
			case "STOP":
			gameServer.socketServer.close();
			process.exit(1);
			break;
					
			case "RESTART":
			gameServer.socketServer.close();
			process.exit(11);
			break;
								
			case "LB":
			var execute = gameServer.commands['board'];
			execute(gameServer,GSARG.split(' '));
			break;
								
			case "RLB":
			var execute = gameServer.commands['boardreset'];
			execute(gameServer,GSARG.split(' '));
			break;
								
			case "KILLALL":
			var execute = gameServer.commands['killall'];
			execute(gameServer,GSARG.split(' '));
			break;
			
			case "GAMEMODE":
			var execute = gameServer.commands['gamemode'];
			execute(gameServer,GSARG.split(' '));
			break;
			
			case "PAUSE":
			var execute = gameServer.commands['pause'];
			execute(gameServer,GSARG.split(' '));
			break;
								
			case "ADDBOT":
			var execute = gameServer.commands['addbots'];
			execute(gameServer,GSARG.split(' '));
			
			default:
			//DEFAULT
			break;			
		}
		
		//RESET COMMAND
		
		GSCMD = "-"
	}
}
exports.updateBorder = function(bt,br,bb,bl){
	border = [bt,br,bb,bl];
}

exports.CreateRandomKey = function(){
	var KeyChar = ['A','B','C','D','E','F','0','1','2','3','4','5','6','7','8','9'];
    var Key = "";
    var KeyA = Math.round(Math.random() * 15);
    Key += KeyChar[KeyA];
    Key += KeyChar[Math.round(Math.random() * 5)];
    Key += KeyChar[KeyA - Math.round(Math.random() * 3)];
    Key += KeyChar[Math.round(Math.random() * 15)];
    AuthKey = Key;
	return Key;
}
exports.createRemoteServer = function(){
	var fillChar = function (data, char, fieldLength, rTL) {
    var result = data.toString();
    if (rTL === true) {
        for (var i = result.length; i < fieldLength; i++)
            result = char.concat(result);
    }
    else {
        for (var i = result.length; i < fieldLength; i++)
            result = result.concat(char);
    }
    return result;
	};

    var server = net.createServer(function(socket) {
		
        socket.setNoDelay(true)
        socket.name = socket.remoteAddress + ":" + socket.remotePort 
        console.log("[Ogar-Plus] Remote GUI connected!");
        console.log("[Ogar-Plus] Remote GUI address : " + socket.name);
        socket.write(AuthVer);
        
        socket.on('data', function (data) {
			socket.setMaxListeners(0)
            var datastring = data.toString();
            var args = datastring.split(' ');
            if(args[0] == AuthKey){
				switch(args[1]){
										
					case "PLAYERCOUNT":
					socket.write(clientsRE.length+" "+configRE.serverMaxConnections);
					break;	
					
					case "BORDERSIZE":
					socket.write(border[0] + " " + border[1] + " " + border[2] + " " + border[3]);
					break;
										
					case "SERVERINFO":
					socket.write(SVinfo);
					break;
										
					case "VIRUSINFO":
					socket.write(VirusInfo);
					break;
					
					case "TEST":
					socket.write("PASS");
					break;
										
					case "STOP":
					socket.write("BYE");
					GSCMD = "STOP";
					break;
					
					case "RESTART":
					socket.write("BYE");
					GSCMD = "RESTART";
					break;
					
					case "KILLALL":
					socket.write("EXEC");
					GSCMD = "KILLALL";
					break;
					
					case "GAMEMODE":
					socket.write("EXEC");
					GSCMD = "GAMEMODE";
					GSARG = "N " + args[2];
					break;
					
					case "LB":
					GSCMD = "LB";
					var splt = args[2];
					splt = splt.replace(";"," ");
					splt = splt.replace(";"," ");
					splt = splt.replace(";"," ");
					splt = splt.replace(";"," ");
					splt = splt.replace(";"," ");
					splt = splt.replace(";"," ");
					splt = splt.replace(";"," ");
					splt = splt.replace(";"," ");
					splt = splt.replace(";"," ");
					GSARG = "N " + splt;
					socket.write("OK");
					break;
					
					case "RLB":
					GSCMD = "RLB";
					GSARG = "N N";
					socket.write("OK");
					break;
					
					case "PAUSE":
					socket.write("EXEC");
					GSCMD = "PAUSE";
					break;
					
					case "ADDBOT":
					socket.write("EXEC");
					GSCMD = "ADDBOT";
					GSARG = "N " + args[2];
					break;
					
					default:
						//DEFAULT
					break;					
				}    
			}
            else if(args[0] == "REAUTH"){
				if(REAUTH == true){
					REAUTH = false;
					socket.write(AuthKey);
				}
			}
			else{
				socket.write("INVALIDKEY");
				//socket.pipe(socket);
			}
            
        });
        
        socket.on('close', function(data) {
            console.log("[Ogar-Plus] Remote GUI disconnected!");
        });
        
        socket.on('error', function(error){ console.log("[Ogar-Plus] "+ error.toString());});
        
    }).listen(556, '0.0.0.0');
	//server.removeListener('connection', callback);
}