module.exports = {
    Mode: require('./Mode'),
    FFA: require('./FFA'),
    Teams: require('./Teams'),
    Experimental: require('./Experimental'),
	VO: require('./VO'),
    TVO: require('./TVO'),
    Tournament: require('./Tournament'),
    HungerGames: require('./HungerGames'),
	Rainbow: require('./Rainbow'),
    Debug: require('./Debug'),
    Zombie: require('./Zombie'),
    TeamZ: require('./TeamZ.js'),
    TeamX: require('./TeamX.js'),
    FFATime: require('./FFATime.js')
};

var get = function(id) {
    var mode;
    switch (id) {
        case 1: // Teams
            mode = new module.exports.Teams();
            break;
        case 2: // Experimental
            mode = new module.exports.Experimental();
            break;
		case 3: // Virus Off
            mode = new module.exports.VO();
            break;
        case 4: // Team Virus Off
            mode = new module.exports.TVO();
            break;
        case 10: // Tournament
            mode = new module.exports.Tournament();
            break;
        case 11: // Hunger Games
            mode = new module.exports.HungerGames();
            break;
        case 12: // Zombie
            mode = new module.exports.Zombie();
            break;
        case 13: // Zombie Team
            mode = new module.exports.TeamZ();
            break;
        case 14: // Experimental Team
            mode = new module.exports.TeamX();
            break;
        case 15: // FFA Time
            mode = new module.exports.FFATime();
            break;
        case 20: // Rainbow
            mode = new module.exports.Rainbow();
            break;
        case 21: // Debug
            mode = new module.exports.Debug();
            break;
        default: // FFA is default
            mode = new module.exports.FFA();
            break;
    }
    return mode;
};

module.exports.get = get;

