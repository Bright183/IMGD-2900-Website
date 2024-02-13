/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/


let treasureX;
let treasureY;

//Array of Traps with their x and y
let traps = [];

let gameOver;
let youWin;
let goToNextLevel;
let levelFourClicksLeft;
let level = 1;

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.
	gameOver = false;
	youWin = false;
	goToNextLevel = false;
	levelFourClicksLeft = 10;

	if(level == 1){
		PS.gridSize( 16, 16 );
		PS.statusText( "Find the Treasure: Level 1" );
		initializeLevel(16, 2, 3);
	}
	if(level == 2){
		PS.gridSize( 24, 24 );
		PS.statusText( "Find the Treasure: Level 2" );
		initializeLevel(24, 10, 15);
	}
	if(level == 3){
		PS.gridSize( 32, 32 );
		PS.statusText( "Find the Treasure: Level 3" );
		initializeLevel(32, 20, 30);
	}
	if(level == 4){
		PS.gridSize( 32, 32 );
		PS.statusText( "Level 4: 10 Moves Left" );
		initializeLevel(32, 25, 35);
	}


	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// Add any other initialization code you need here.

	// load audio
	PS.audioLoad( "fx_uhoh" );
	PS.audioLoad( "fx_tada" );
	PS.audioLoad( "fx_wilhelm" );
	
	
};

function initializeLevel(size, randomMin, randomMax){
	PS.gridColor( { rgb : 0x000000 } );
	
	PS.statusColor(PS.COLOR_GREEN);


	//Location of the treasure
	treasureX = Math.floor(Math.random() * size);
	treasureY = Math.floor(Math.random() * size);

	//For testing get rid afterwards
	//PS.color(treasureX, treasureY, PS.COLOR_YELLOW);

	let numOfTraps = getRandomArbitraryNum(randomMin, randomMax);

	//For loop to create traps
	for(let i=0; i<numOfTraps; i++){
		//Creates traps and makes sure that cannot be near treause
		traps[i] = generateTrapLocation(treasureX, treasureY);
	}
}


//Gets random num with min and max
function getRandomArbitraryNum(min, max) {
    return Math.random() * (max - min) + min;
}

//Generates an array for a trap location
function generateTrapLocation(givenX, givenY){

	let trapX = Math.floor(Math.random() * 32);
	let trapY = Math.floor(Math.random() * 32);

	if(trapValid(trapX, trapY, givenX, givenY) == false){
		return generateTrapLocation();
	}

	//Temp for testing
	//PS.color(trapX, trapY, PS.COLOR_RED);
	return [trapX, trapY];
	
}

//Checks if the trap location is valid
function trapValid(trapX, trapY, givenX, givenY){
	let minDistance = 3;
	if((trapX == givenX && trapY == givenY) ||
	((trapX <= (givenX + minDistance)) && (trapX >= (givenX - minDistance))) ||
	((trapY <= (givenY + minDistance)) && (trapY >= (givenY - minDistance)))){
		return false;
	}
}


function distanceFromTreasure(givenX, givenY){
    let closeDistance = 8;
    let mediumDistance = 18;
    let farDistance = 32;
    let distance = Math.abs(treasureX - givenX) + Math.abs(treasureY - givenY);

    if (distance <= closeDistance) {
        return 1;
    } else if (distance <= mediumDistance) {
        return 2;
    } else if (distance <= farDistance) {
        return 3;
    } else {
        return 0; 
    }
}

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.


    //Change color of clicked bead based on distance from the treasure
    changeColorWithDistance(x, y);

    //Change color of surrounding beads based on distance from the treasure
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            //Exclude the clicked bead
            if (i !== x || j !== y) {
                //Check if the bead is within the grid boundaries
                if (i >= 0 && i < PS.gridSize().width && j >= 0 && j < PS.gridSize().height) {
					changeColorWithDistance(i, j); 
                }
            }
        }
    }


	//Win if you click the treasure
	if(x === treasureX && y === treasureY){
		PS.statusColor(PS.COLOR_YELLOW);
		PS.color(treasureX, treasureY, PS.COLOR_YELLOW);
		PS.audioPlay( "fx_tada" );
		PS.active ( PS.ALL, PS.ALL, false );
		if(level == 4){
			PS.statusText( "You Win! Press Enter to Restart" );
			gameOver = true;
			youWin = true;
		}else{
			if(level == 1){
				level = 2;
				PS.statusText( "Press Enter to go to Next Level" );
				goToNextLevel = true;
			}else if(level == 2){
				level = 3;
				PS.statusText( "Press Enter to go to Next Level" );
				goToNextLevel = true;
			}else if(level == 3 && !goToNextLevel){
				level = 4;
				PS.statusText( "Press Enter to go to Next Level" );
				goToNextLevel = true;
			}
		}
	}

	for(let i=0; i<traps.length; i++){
		//Clicked on trap (Lose)
		if(triggeredTrap(traps[i], x, y) == true){
			PS.statusColor(PS.COLOR_RED);
			PS.statusText( "You Lose! Press Enter to Restart" );
			PS.color(x, y, PS.COLOR_RED);
			PS.audioPlay( "fx_uhoh" );
			PS.active ( PS.ALL, PS.ALL, false );
			gameOver = true;
		}
	}

	if(levelFourClicksLeft == 1 && !youWin){
		PS.statusColor(PS.COLOR_RED);
		PS.statusText( "You Lose! Press Enter to Restart" );
		PS.audioPlay( "fx_wilhelm" );
		PS.active ( PS.ALL, PS.ALL, false );
		gameOver = true;
	}

	if(level == 4 && levelFourClicksLeft != 1 && !goToNextLevel && !youWin){
		levelFourClicksLeft--;
		PS.statusText("Level 4: " + (levelFourClicksLeft) + " Moves Left");
	}


	
};


//Checks if you clicked a trap
function triggeredTrap(trapLocation, clickedX, clickedY){
	if(trapLocation[0] == clickedX && trapLocation[1] == clickedY){
		return true;
	}else{
		return false;
	}
}


//Change color of a bead based on distance from the treasure
function changeColorWithDistance(givenX, givenY) {

	//Check if the bead is a treasure or a trap
	if ((givenX === treasureX && givenY === treasureY)) {
		//PS.color(givenX, givenY, PS.YELLOW);
		return;
	}

	//Check if the bead is a trap
    for (let i = 0; i < traps.length; i++) {
        if (traps[i][0] === givenX && traps[i][1] === givenY) {
            //PS.color(givenX, givenY, PS.COLOR_RED);
			return;
        }
    }

    // Calculate distance from the clicked bead to the treasure
    let distance = Math.sqrt(Math.pow(givenX - treasureX, 2) + Math.pow(givenY - treasureY, 2));
    // Set color based on distance
    let color;
	if (distance <= 2) {
        color = PS.COLOR_GREEN;
    }else if (distance <= 12) {
        color = PS.COLOR_BLUE;
    }else if (distance <= 20) {
        color = PS.COLOR_VIOLET;
    }else{
		color = 100,69,19;
	}
    PS.color(givenX, givenY, color);

	for(let i = 0; i < traps.length; i++){
		if ((traps[i][0] + 1 === givenX && traps[i][1] + 1 === givenY) ||
			(traps[i][0] - 1 === givenX && traps[i][1] - 1 === givenY) ||	
			(traps[i][0] + 1 === givenX && traps[i][1] - 1 === givenY) ||
			(traps[i][0] - 1 === givenX && traps[i][1] + 1 === givenY) ||
			(traps[i][0] + 1 === givenX && traps[i][1] === givenY) ||
			(traps[i][0] - 1 === givenX && traps[i][1] === givenY) ||
			(traps[i][0] === givenX && traps[i][1] + 1 === givenY) ||
			(traps[i][0] === givenX && traps[i][1] - 1 === givenY)) {
            PS.color(givenX, givenY, 250, 95, 85);
			return;
        }
		
	}

	//Check if the bead is a treasure or a trap
	if ((givenX === treasureX && givenY === treasureY)) {
		//PS.color(givenX, givenY, PS.YELLOW);
		return;
	}

	//Check if the bead is a trap
    for (let i = 0; i < traps.length; i++) {
        if (traps[i][0] === givenX && traps[i][1] === givenY) {
            //PS.color(givenX, givenY, PS.COLOR_RED);
			return;
        }
    }


}


/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
	if(youWin && gameOver && key == PS.KEY_ENTER){
		level = 1;
		PS.init();
	}else if(gameOver && key == PS.KEY_ENTER){
		PS.init();
	}else if(goToNextLevel && !gameOver && key == PS.KEY_ENTER){
		PS.init();
	}

};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

