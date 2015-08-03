# Modification Guide

If you want to make changes to your server, just follow this guide!

##Basic coding experience (optional)

There are a few things to know first!
functions are the start of a new code block. Blocks are areas of code in Curly brackets{}. Following them come
parameters which are in parenthesis. EX:

'''
function Hello(name) {
	name = "Seth"
	console.log("Hello, " + name"!")
}
'''

This code block would say "Hello, Seth!" in the console if you type Hello.
You can learn more about coding in javascript at https://www.codecademy.com/courses/getting-started-v2/0/1

##Console Startup Messages

Most in the main index.js file, all you have to do is modify the text in the "strings".
If you wanted to change some of the messages that weren't in there, they are in modules/log.js.

##Custom Bye Messages (text shown when you stop the server)

Located in modules/CommandList. The stop command is where my custom "bye!" coding is.

##Commands
Located in modules/CommandList, just like the stop command, of course. 
If you're skilled then you could change the function, but for amateurs just stick to changing the"string".

##Console Colors
If you want to add colors to your server console, you're gonna have to modify your Start.bat file.
simply add in the color you want when there are no errors before node index.js and the color
when an error is found after it! Simple! Example:

'''
@echo off
Title Agar.io Server

color 0A

node index.js

color 0c
echo.
pause
'''

For the color codes go [here](http://ss64.com/nt/color.html)

##Entities

In the entity folder, you can modify the files if you have enough experience, or you can only modify the index
file, which is easy. For example, if You want to eject viruses, just change the ejected mass folder to the
virus folder! Like this:
	
	Before:
module.exports = {
    Cell: require('./Cell'),
    PlayerCell: require('./PlayerCell'),
    Food: require('./Food'),
    Virus: require('./Virus'),
    EjectedMass: require('./EjectedMass'),
};
	
	After:
module.exports = {
    Cell: require('./Cell'),
    PlayerCell: require('./PlayerCell'),
    Food: require('./Food'),
    Virus: require('./Virus'),
    EjectedMass: require('./Virus'),
};
	
	Simple, right?

There are much more this you can do, but this is just what I decided to put together. Have fun!