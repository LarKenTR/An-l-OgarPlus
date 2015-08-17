var Commands = require('./modules/CommandList');
var GameServer = require('./GameServer');

var gameServer = new GameServer();
gameServer.start();
gameServer.commands = Commands.list;
gameServer.breakServer();