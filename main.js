let shared;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "hello_party");
	shared = partyLoadShared("shared");
}

function setup() {
	// set defaults on shared data
	shared.tileMap = shared.tileMap || generateLevel();
	start();
}




let tileSizeX = 70;
let tileSizeY = 70;
let cloneCountX = Math.ceil(window.screen.width / tileSizeX) + 1;
let cloneCountY = Math.ceil(window.screen.height / tileSizeY) + 1;
let tileData = { x: {}, y: {}, tileIndex: {} };
let tileX = 0;
let tileY = 0;
let tileIndex = 0;
let tileClassList = ["Wood-0", "Wood-1", "Wood-2", "Wood-3", "Wood-4", "Wood-5", "Block-Gold", "Block-Wood", "Blue-1", "Blue-2", "Blue-3", "Blue-4", "Blue-5", "Blue-6", "Blue-7", "Blue-8", "Blue-9", "Blank"];
let controls = {};

let tileMap = [];
let mapWidth = 60;
let mapHeight = 60;

let cameraX = 0;
let cameraY = (mapHeight * tileSizeY) - window.innerHeight;

let speed = 10;

let inside;

let mouseX, mouseY;


function start() {
	createTiles();
	createCursor();
	loop();
}


function createCursor() {
	let element = document.createElement("div");
	element.id = "cursor"
	element.classList.add("redDot");
	document.getElementById("container").appendChild(element);
}


function createTiles() {
	let element;
	if (document.getElementById("container") != null) {
		document.getElementById("container").remove();
	}
	element = document.createElement("div");
	element.id = "container";
	document.body.appendChild(element);
	tileX = 0;
	for (i = 0; i < cloneCountX; i++) {
		tileY = 0;
		for (j = 0; j < cloneCountY; j++) {
			element = document.createElement("div");
			element.classList.add("tile");
			element.classList.add(tileClassList[1]);
			element.id = "tile" + i + "-" + j;
			document.getElementById("container").appendChild(element);
			document.getElementById("tile" + i + "-" + j).style.left = tileX + "px";
			document.getElementById("tile" + i + "-" + j).style.top = tileY + "px";

			tileData.x["tile" + i + "-" + j] = tileX;
			tileData.y["tile" + i + "-" + j] = tileY;
			tileData.tileIndex["tile" + i + "-" + j] = tileIndex;

			tileY += tileSizeY;
			tileIndex++
		}
		tileX += tileSizeX;
		tileIndex += mapHeight - cloneCountY;
	}
}


function positionTiles() {
	for (i = 0; i < cloneCountX; i++) {
		for (j = 0; j < cloneCountY; j++) {
			tileX = tileData.x["tile" + i + "-" + j];
			tileY = tileData.y["tile" + i + "-" + j];
			tileIndex = tileData.tileIndex["tile" + i + "-" + j];

			if (tileX - cameraX < 0 - tileSizeX) {
				loopTileX(cloneCountX)
			}
			if (tileX - cameraX > (cloneCountX * tileSizeX) - tileSizeX) {
				loopTileX(-cloneCountX)
			}

			if (tileY - cameraY < 0 - tileSizeY) {
				loopTileY(cloneCountY);
			}
			if (tileY - cameraY > (cloneCountY * tileSizeY) - tileSizeY) {
				loopTileY(-cloneCountY);
			}

			document.getElementById("tile" + i + "-" + j).style.left = (tileX - cameraX) + "px";
			document.getElementById("tile" + i + "-" + j).style.top = (tileY - cameraY) + "px";
			document.getElementById("tile" + i + "-" + j).classList.remove(document.getElementById("tile" + i + "-" + j).classList[1]);
			document.getElementById("tile" + i + "-" + j).classList.add(shared.tileMap[tileData.tileIndex["tile" + i + "-" + j]]);
		}
	}
}


function loopTileX(tileSkip) {
	tileX += tileSkip * tileSizeX;
	tileData.x["tile" + i + "-" + j] = tileX;
	tileIndex += tileSkip * mapHeight;
	tileData.tileIndex["tile" + i + "-" + j] = tileIndex;
}


function loopTileY(tileSkip) {
	tileY += tileSkip * tileSizeY;
	tileData.y["tile" + i + "-" + j] = tileY;
	tileIndex += tileSkip;
	tileData.tileIndex["tile" + i + "-" + j] = tileIndex;
}


//____________________________________________________________________________________________________
//___________________________________________Generate Level___________________________________________
//____________________________________________________________________________________________________


function generateLevel() {
	tileMap = [];
	addWallColumn();
	for (i = 0; i < mapWidth - 2; i++) {
		addBoxedColumn();
	}
	addWallColumn();
	return tileMap;
}


function addWallColumn() {
	for (j = 0; j < mapHeight; j++) {
		tileMap.push("Block-Wood");
	}
}


function addBoxedColumn() {
	tileMap.push("Block-Wood");
	for (j = 0; j < mapHeight - 2; j++) {
		if (Math.random() < 0.3) {
			tileMap.push(tileClassList[Math.floor(Math.random() * tileClassList.length)]);
		} else {
			tileMap.push("Blank");
		}
	}
	tileMap.push("Block-Wood");
}


function moveCamera() {
	if (cameraX < 0) {
		cameraX = 0;
	}

	if (cameraY < 0) {
		cameraY = 0;
	}

	if (cameraX > (mapWidth * tileSizeX) - window.innerWidth) {
		cameraX = (mapWidth * tileSizeX) - window.innerWidth;
	}

	if (cameraY > (mapHeight * tileSizeY) - window.innerHeight) {
		cameraY = (mapHeight * tileSizeY) - window.innerHeight;
	}
}

function control() {
	let changeX = mouseX < 50 ? -1 : (mouseX > window.innerWidth - 50 ? 1 : 0);
	let changeY = mouseY < 50 ? -1 : (mouseY > window.innerHeight - 50 ? 1 : 0);
	if (changeX == 0 || changeY == 0) {
		cameraX += speed * changeX;
		cameraY += speed * changeY;
	} else {
		cameraX += (speed * Math.sqrt(0.5)) * changeX;
		cameraY += (speed * Math.sqrt(0.5)) * changeY;
	}
}

function updateMouse(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
	document.getElementById("cursor").style.left = mouseX - 45 + "px";
	document.getElementById("cursor").style.top = mouseY - 45 + "px";
}

function fullscreen() {
	document.getElementById("container").requestFullscreen();
}

function changeTile(event) {
	console.log(event)
	if (event.code == "Space") {
		for (let i = 0; i < cloneCountX; i++) {
			for (let j = 0; j < cloneCountY; j++) {
				if (tileData.x["tile" + i + "-" + j] == ((mouseX + cameraX) - ((mouseX + cameraX) % tileSizeX)) && tileData.y["tile" + i + "-" + j] == ((mouseY + cameraY) - ((mouseY + cameraY) % tileSizeY))) {
					shared.tileMap[tileData.tileIndex["tile" + i + "-" + j]] = "Wood-0";
				}
			}
		}
	}
}

document.addEventListener("mousemove", updateMouse, false);
//document.addEventListener("mousedown", fullscreen, false);

document.addEventListener('contextmenu', event => {
	event.preventDefault();
});

document.addEventListener("keydown", changeTile, false);


function draw() {
	control();
	moveCamera();
	positionTiles();
	requestAnimationFrame(loop);
}