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

let chickenLocation = [];
let roadLocations = [];
let cars = [];
let carLocationRight1 = [];
let carLocationLeft1 = [];
let carLocationRight2 = [];
let carLocationLeft2 = [];
let worldColor;
let gridSize;
let colorG1;
let colorG2;
let colorG3;
let colorG4;
let gameOver;

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

	gridSize = PS.gridSize( 32, 32 );

	gameOver = false;

	worldColor = [89, 238, 130];
	colorG1 = PS.random(255);
	colorG2 = PS.random(255);
	colorG3 = PS.random(255);
	colorG4 = PS.random(255);

	// Hide all bead borders
	PS.border( PS.ALL, PS.ALL, 0 );
	PS.color ( PS.ALL, PS.ALL, worldColor )

	cars[0] = carLocationRight1;
	cars[1] = carLocationLeft1;
	cars[2] = carLocationRight2;
	cars[3] = carLocationLeft2;

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// Add any other initialization code you need here.


	//Create World
	makeRoad(22, 0, 1, false);
	makeRoad(10, 1, 1, false);
	makePond(16, 2);

	//Create the chicken
	createChicken(16, 30);

	//Create Cars
	createCar(0, roadLocations[0]+2, true, 1, colorG1); // Right
	createCar(gridSize.width+2, roadLocations[0]-2, false, 2, colorG2); // Left
	createCar(0, roadLocations[1]+2, true, 3, colorG3); // Right
	createCar(gridSize.width+2, roadLocations[1]-2, false, 4, colorG4); // Left


	// load audio
	PS.audioLoad( "fx_bang" );
	PS.audioLoad( "fx_tada" );
	PS.audioLoad( "fx_squawk" );


	

};


function makePond(x, y){
	PS.color(x, y, PS.COLOR_BLUE);
	PS.color(x+1, y, PS.COLOR_BLUE);
	PS.color(x-1, y, PS.COLOR_BLUE);
	PS.color(x, y+1, PS.COLOR_BLUE);
	PS.color(x, y-1, PS.COLOR_BLUE);
	PS.color(x+1, y+1, PS.COLOR_BLUE);
	PS.color(x-1, y-1, PS.COLOR_BLUE);
	PS.color(x+2, y-2, PS.COLOR_BLUE);
	PS.color(x-2, y-1, PS.COLOR_BLUE);
	PS.color(x+1, y-2, PS.COLOR_BLUE);
	PS.color(x, y-2, PS.COLOR_BLUE);
	PS.color(x+1, y-1, PS.COLOR_BLUE);
	PS.color(x-1, y-2, PS.COLOR_BLUE);
	PS.color(x-2, y-2, PS.COLOR_BLUE);
	PS.color(x-3, y-2, PS.COLOR_BLUE);
	PS.color(x+3, y-2, PS.COLOR_BLUE);
	PS.color(x+4, y-2, PS.COLOR_BLUE);
	PS.color(x+2, y-1, PS.COLOR_BLUE);
	PS.color(x+2, y, PS.COLOR_BLUE);
	PS.color(x+3, y-1, PS.COLOR_BLUE);
}

function createChicken(x, y){
	PS.color(x, y, PS.COLOR_WHITE);
	PS.color(x+1, y, PS.COLOR_WHITE);
	PS.color(x-1, y, PS.COLOR_WHITE);
	PS.color(x, y+1, 250, 95, 85);
	PS.color(x-1, y-1, PS.COLOR_WHITE);
	PS.color(x-2, y-1, 250, 95, 85);

	chickenLocation[0] = x;
	chickenLocation[1] = y;
}


function deletePreviousChicken(x, y){
	PS.color(x, y, worldColor);
	PS.color(x+1, y, worldColor);
	PS.color(x-1, y, worldColor);
	PS.color(x, y+1, worldColor);
	PS.color(x-1, y-1, worldColor);
	PS.color(x-2, y-1, worldColor);

	//Re-creates the roads you go over
	for(let i=0; i<roadLocations.length; i++){
		if(y == roadLocations[i] || y+1 == roadLocations[i] || y-1 == roadLocations[i] 
			|| y+2 == roadLocations[i] || y-2 == roadLocations[i] 
			|| y+3 == roadLocations[i] || y-3 == roadLocations[i] 
			|| y+4 == roadLocations[i] || y-4 == roadLocations[i]){

			makeRoad(roadLocations[i], i, 1, true);
		}
	}

}



let myCounterRight = 3;
let myTimerIDRight = -1;

//Move car1 right
function moveCarRight1() {
	if ( myCounterRight > 0 ) {
		//PS.statusText( "T-minus " + myCounterRight );
		myCounterRight -= 1; // decrement counter
	}else {
		//PS.statusText( "Lift off!" );
		myCounterRight = 3;
		PS.timerStop( myTimerIDRight ); // stop timer
		myTimerIDRight = -1;
		deleteCar(carLocationRight1[0], carLocationRight1[1]);
		createCar(carLocationRight1[0]+1, carLocationRight1[1], true, 1, colorG1);
		if(carLocationRight1[0]-2 > gridSize.width){
			createCar(-2, carLocationRight1[1], true, 1, colorG1);
		}
	}
};

let myCounterLeft = 3;
let myTimerIDLeft = -1;

//Move car1 left
function moveCarLeft1() {
	if ( myCounterLeft > 0 ) {
		myCounterLeft -= 1; // decrement counter
	}else {
		myCounterLeft = 3;
		PS.timerStop( myTimerIDLeft ); // stop timer
		myTimerIDLeft = -1;
		deleteCar(carLocationLeft1[0], carLocationLeft1[1]);
		createCar(carLocationLeft1[0]-1, carLocationLeft1[1], false, 2, colorG2);
		if(carLocationLeft1[0]+2 < 0){
			createCar(gridSize.width+2, carLocationLeft1[1], false, 2, colorG2);
		}
	}
};

let myCounterRight2 = 3;
let myTimerIDRight2 = -1;

//Move car2 right
function moveCarRight2() {
	if ( myCounterRight2 > 0 ) {
		myCounterRight2 -= 1; // decrement counter
	}else {
		myCounterRight2 = 3;
		PS.timerStop( myTimerIDRight2 ); // stop timer
		myTimerIDRight2 = -1;
		deleteCar(carLocationRight2[0], carLocationRight2[1]);
		createCar(carLocationRight2[0]+1, carLocationRight2[1], true, 3, colorG3);
		if(carLocationRight2[0]-2 > gridSize.width){
			createCar(-2, carLocationRight2[1], true, 3, colorG3);
		}
	}

};

let myCounterLeft2 = 3;
let myTimerIDLeft2 = -1;

//Move car2 left
function moveCarLeft2() {
	if ( myCounterLeft2 > 0 ) {
		myCounterLeft2 -= 1; // decrement counter
	}else {
		myCounterLeft2 = 3;
		PS.timerStop( myTimerIDLeft2 ); // stop timer
		myTimerIDLeft2 = -1;
		deleteCar(carLocationLeft2[0], carLocationLeft2[1]);
		createCar(carLocationLeft2[0]-1, carLocationLeft2[1], false, 4, colorG4);
		if(carLocationLeft2[0]+2 < 0){
			createCar(gridSize.width+2, carLocationLeft2[1], false, 4, colorG4);
		}
	}
};




function createCar(x, y, right, id, colorG){

	checkHit();

	if (myTimerIDRight == -1 && right && id == 1) { // Only start a new timer if one isn't already running
        myTimerIDRight = PS.timerStart(3, moveCarRight1);
    }
	if (myTimerIDLeft == -1 && !right && id == 2) { // Only start a new timer if one isn't already running
        myTimerIDLeft = PS.timerStart(3, moveCarLeft1);
    }
	if (myTimerIDRight2 == -1 && right && id == 3) { // Only start a new timer if one isn't already running
        myTimerIDRight2 = PS.timerStart(1.5, moveCarRight2);
    }
	if (myTimerIDLeft2 == -1 && !right && id == 4) { // Only start a new timer if one isn't already running
        myTimerIDLeft2 = PS.timerStart(1.5, moveCarLeft2);
    }

	if(x >= 0 && x < gridSize.width){
		PS.color( x, y, 144, colorG, 0);
		PS.color( x, y-1, 144, colorG, 0);
	}
	if(x+1 >= 0 && x+1 < gridSize.width){
		PS.color( x+1, y, 144, colorG, 0);
		PS.color( x+1, y-1, 144, colorG, 0);
		PS.color( x+1, y+1, 120,120,120);
	}
	if(x+1 >= 0 && x+2 < gridSize.width){
		PS.color( x+2, y, 144, colorG, 0);
	}
	if(x-1 >= 0 && x-1 < gridSize.width){
		PS.color( x-1, y, 144, colorG, 0);
		PS.color( x-1, y-1, 144, colorG, 0);
		PS.color( x-1, y+1, 120,120,120);
	}
	if(x-2 >= 0 && x-2 < gridSize.width){
		PS.color( x-2, y, 144, colorG, 0);
	}

	if(id == 1){
		carLocationRight1[0] = x;
		carLocationRight1[1] = y;
	}else if(id == 2){
		carLocationLeft1[0] = x;
		carLocationLeft1[1] = y;
	}else if(id == 3){
		carLocationRight2[0] = x;
		carLocationRight2[1] = y;
	}else if(id == 4){
		carLocationLeft2[0] = x;
		carLocationLeft2[1] = y;
	}

	
}

function drawGameOverCars(){
	let colorGr;
	for(let i=0; i<cars.length; i++){
		if(i === 0){
			colorGr = colorG1
		}else if(i === 1){
			colorGr = colorG2
		}else if(i === 2){
			colorGr = colorG3
		}else if(i === 3){
			colorGr = colorG4
		}

		if(cars[i][0] >= 0 && cars[i][0] < gridSize.width){
			PS.color( cars[i][0], cars[i][1], 144, colorGr, 0);
			PS.color( cars[i][0], cars[i][1]-1, 144, colorGr, 0);
		}
		if(cars[i][0]+1 >= 0 && cars[i][0]+1 < gridSize.width){
			PS.color( cars[i][0]+1, cars[i][1], 144, colorGr, 0);
			PS.color( cars[i][0]+1, cars[i][1]-1, 144, colorGr, 0);
			PS.color( cars[i][0]+1, cars[i][1]+1, 120,120,120);
		}
		if(cars[i][0]+1 >= 0 && cars[i][0]+2 < gridSize.width){
			PS.color( cars[i][0]+2, cars[i][1], 144, colorGr, 0);
		}
		if(cars[i][0]-1 >= 0 && cars[i][0]-1 < gridSize.width){
			PS.color( cars[i][0]-1, cars[i][1], 144, colorGr, 0);
			PS.color( cars[i][0]-1, cars[i][1]-1, 144, colorGr, 0);
			PS.color( cars[i][0]-1, cars[i][1]+1, 120,120,120);
		}
		if(cars[i][0]-2 >= 0 && cars[i][0]-2 < gridSize.width){
			PS.color( cars[i][0]-2, cars[i][1], 144, colorGr, 0);
		}
	}

}

function deleteCar(x, y){
	if(x >= 0 && x < gridSize.width){
		PS.color( x, y, PS.COLOR_BLACK);
		PS.color( x, y-1, PS.COLOR_BLACK);
	}
	if(x+1 >= 0 && x+1 < gridSize.width){
		PS.color( x+1, y, PS.COLOR_BLACK);
		PS.color( x+1, y+1, PS.COLOR_BLACK);
		PS.color( x+1, y-1, PS.COLOR_BLACK);
	}
	if(x+1 >= 0 && x+2 < gridSize.width){
		PS.color( x+2, y, PS.COLOR_BLACK);
	}
	if(x-1 >= 0 && x-1 < gridSize.width){
		PS.color( x-1, y, PS.COLOR_BLACK);
		PS.color( x-1, y-1, PS.COLOR_BLACK);
		PS.color( x-1, y+1, PS.COLOR_BLACK);
	}
	if(x-2 >= 0 && x-2 < gridSize.width){
		PS.color( x-2, y, PS.COLOR_BLACK);
	}

}

function makeRoad(y, roadNum, variation, chickenMovement){
	
	if(!chickenMovement){
		for(let i=0; i<gridSize.width; i++){
			//Creates black road
			PS.color(i, y, PS.COLOR_BLACK);
			PS.color(i, y+1, PS.COLOR_BLACK);
			PS.color(i, y-1, PS.COLOR_BLACK);
			PS.color(i, y+2, PS.COLOR_BLACK);
			PS.color(i, y-2, PS.COLOR_BLACK);
			PS.color(i, y+3, PS.COLOR_BLACK);
			PS.color(i, y-3, PS.COLOR_BLACK);
		}
	
		if(variation == 1){
			for(let i=0; i<gridSize.width; i++){
				if(i < gridSize.width-1){
					//Creates yellow stripes
					PS.color(i, y, PS.COLOR_YELLOW)
					PS.color(i+1, y, PS.COLOR_YELLOW)
					if((i+1)%3 == 0){
						PS.color(i, y, PS.COLOR_BLACK)
						PS.color(i+1, y, PS.COLOR_BLACK)
					}
				}
			}
		}	
	
		roadLocations[roadNum] = y;

	}else if(chickenMovement){

		for(let i=0; i<roadLocations.length; i++){
			if(roadLocations[i] == chickenLocation[1] || roadLocations[i]+1 == chickenLocation[1] || roadLocations[i]+2 == chickenLocation[1] 
														|| roadLocations[i]-1 == chickenLocation[1] || roadLocations[i]-2 == chickenLocation[1]){
				PS.color(chickenLocation[0], chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0], chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0], chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1]-1, PS.COLOR_BLACK);

			}else if(roadLocations[i]+3 == chickenLocation[1]){
				PS.color(chickenLocation[0], chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0], chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1]-1, PS.COLOR_BLACK);

			}else if(roadLocations[i]-3 == chickenLocation[1]){
				PS.color(chickenLocation[0], chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0], chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1], PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1]+1, PS.COLOR_BLACK);

			}else if(roadLocations[i]+4 == chickenLocation[1]){
				PS.color(chickenLocation[0], chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1]-1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1]-1, PS.COLOR_BLACK);

			}else if(roadLocations[i]-4 == chickenLocation[1]){
				PS.color(chickenLocation[0], chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]+1, chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-1, chickenLocation[1]+1, PS.COLOR_BLACK);
				PS.color(chickenLocation[0]-2, chickenLocation[1]+1, PS.COLOR_BLACK);
			}


		}
		if(variation == 1){
			for(let i=0; i<gridSize.width; i++){
				if(i < gridSize.width-1){
					//Creates yellow stripes
					PS.color(i, y, PS.COLOR_YELLOW)
					PS.color(i+1, y, PS.COLOR_YELLOW)
					if((i+1)%3 == 0){
						PS.color(i, y, PS.COLOR_BLACK)
						PS.color(i+1, y, PS.COLOR_BLACK)
					}
				}
			}
		}	
	}
}


function checkHit(){
	for(let i=0; i<cars.length; i++){
		if(chickenLocation[0]+1 >= cars[i][0]-2 && chickenLocation[0]-2 <= cars[i][0]+2 
			&& chickenLocation[1]+1 >= cars[i][1]-1 && chickenLocation[1]-1 <= cars[i][1]+1){
			PS.statusText("You Lose!");
			drawGameOverCars();
			drawExplosion(cars[i][0], cars[i][1]);
			if(!gameOver){
				PS.audioPlay( "fx_bang", { volume: 0.5 } );
				gameOver = true;
			}
			PS.active ( PS.ALL, PS.ALL, false );
		}
	}
	if(chickenLocation[0] > 13 && chickenLocation[0] < 20 && chickenLocation[1] < 5){
		drawGameOverCars();
		PS.statusText("You got to the pond!");
		if(!gameOver){
			PS.audioPlay( "fx_tada" );
			gameOver = true;
		}
		PS.active ( PS.ALL, PS.ALL, false );
	}

}


function drawExplosion(x, y){
	for(let xOffset = -3; xOffset < 4; xOffset++) {
		for(let yOffset = -3; yOffset < 4; yOffset++) {
			if(inBounds(x+xOffset, y+yOffset)) {
				const distance = Math.abs(xOffset) + Math.abs(yOffset)
				let color
				switch(distance) {
						case 0:
						case 1:
							color = PS.COLOR_RED
							break
						case 2:
							color = PS.COLOR_ORANGE
							break
						case 3:
							color = PS.COLOR_YELLOW
							break
						default:
							color = undefined
				}

				if(color !== undefined) {
					PS.color( x+xOffset, y+yOffset, color)
				}
			}
		}
	}
}

function inBounds(x, y) {
	return (x >= 0) && (x < gridSize.width) && (y >= 0) && (y < gridSize.height)
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








	
};




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


	// Chicken Movement
	if(key == PS.KEY_ARROW_UP || key == 119 || key == 87){
		if(chickenLocation[1]-1 > 0){
			deletePreviousChicken(chickenLocation[0], chickenLocation[1]);
			createChicken(chickenLocation[0], chickenLocation[1]-1);
			PS.audioPlay( "fx_squawk" );
		}
	}else if(key == PS.KEY_ARROW_DOWN || key == 115 || key == 83){
		if(chickenLocation[1]+1 < gridSize.height-1 ){
			deletePreviousChicken(chickenLocation[0], chickenLocation[1]);
			createChicken(chickenLocation[0], chickenLocation[1]+1);
			PS.audioPlay( "fx_squawk" );
		}
	}else if(key == PS.KEY_ARROW_LEFT || key == 97 || key == 65){
		if(chickenLocation[0]-2 > 0 ){
			deletePreviousChicken(chickenLocation[0], chickenLocation[1]);
			createChicken(chickenLocation[0]-1, chickenLocation[1]);
			PS.audioPlay( "fx_squawk" );
		}
	}else if(key == PS.KEY_ARROW_RIGHT || key == 100 || key == 68){
		if(chickenLocation[0]+1 < gridSize.width-1 ){
			deletePreviousChicken(chickenLocation[0], chickenLocation[1]);
			createChicken(chickenLocation[0]+1, chickenLocation[1]);
			PS.audioPlay( "fx_squawk" );
		}
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

	let event;
	event = sensors.wheel;

	if(event){
		if(event === PS.WHEEL_FORWARD){
			if(chickenLocation[1]-1 > 0){
				deletePreviousChicken(chickenLocation[0], chickenLocation[1]);
				createChicken(chickenLocation[0], chickenLocation[1]-1);
				PS.audioPlay( "fx_squawk" );
			}
		}else if(event === PS.WHEEL_BACKWARD){
			if(chickenLocation[1]+1 < gridSize.height-1 ){
				deletePreviousChicken(chickenLocation[0], chickenLocation[1]);
				createChicken(chickenLocation[0], chickenLocation[1]+1);
				PS.audioPlay( "fx_squawk" );
			}
		}
	}
};

