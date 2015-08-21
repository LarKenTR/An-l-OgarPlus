var GameMode = require('./gamemodes');
var Entity = require('./entity');
var PlayerTracker = require('./PlayerTracker');
var Commands = require('./modules/CommandList');
var net = require('net');

var	clientsRE = [];
var	configRE = {};
var	gameServerRE = null;
var RemotePort = 556;
var AuthVer = "AU01"
var AuthKey = "ABCD"

exports.updateConfig = function(config){
	configRE = config;
}
exports.updateClients = function(clients){
	clientsRE = clients;
}
exports.updateGameServer = function(gameServer){
	gameServerRE = gameServer;
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
					
					case "PLAYERLIST":
					var tosend  = getPLString();
					socket.write(tosend);
					//socket.pipe(socket);
					break;
										
					case "PLAYERCOUNT":
					socket.write(clientsRE.length+" "+configRE.serverMaxConnections);
					//socket.pipe(socket);
					break;
					
					case "TEST":
					socket.write("PASS");
					//socket.pipe(socket);
					break;
					
					
					default:
						//DEFAULT
					break;					
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

var getPLString = function(){
	var datatoret = "";
	for (var i = 0; i < clientsRE.length; i++) {
            var client = clientsRE[i].playerTracker;
            datatoret += " " + client.pID;
        }
	return datatoret;
}