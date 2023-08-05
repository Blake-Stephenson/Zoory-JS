import { HexGrid, Mask, Bar, Hitbox } from "./src/GUI.js";


// Create the PIXI application and set its properties
const app = new PIXI.Application({
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x420420,
	width: 1280,
	height: 720
});
// Add the PIXI application's view (canvas) to the container
document.body.appendChild(app.view);

//make tool bar
const bar = new Bar(app.screen);

//create board, contains grid
const board = new PIXI.Container();
let grid = new HexGrid(4,8,bar,app.screen);
board.addChild(grid.getGrid());

//create game hitbox
const hitbox = new Hitbox(app.screen, grid);

//create mask
const mask = new Mask(app.screen, grid);

//add to app, board<mask<toolbar
app.stage.addChild(hitbox.getHitbox());
app.stage.addChild(board);
app.stage.addChild(mask.getMask());
app.stage.addChild(bar.getBar());
