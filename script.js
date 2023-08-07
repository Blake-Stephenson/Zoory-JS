import { HexGrid, Mask, Bar, Hitbox } from "./src/GUI.js";

var board_data = {};
var loadedDB = false;

//fetch board data from server
fetch("https://zoory-db.epicblake8.repl.co/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Process the response data
    
    console.log(data);
    console.log(data.table);
    board_data = data.table;
    console.log(board_data[0].length);
    loadedDB = true;
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });






function resolveAfterDelay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Resolved after ${delay} milliseconds`);
    }, delay);
  });
}

async function exampleAsyncFunction() {
  console.log('Before await');
  const result = await resolveAfterDelay(2000); // The function will pause here until the promise is resolved.
  
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
  let grid = new HexGrid(board_data, bar, app.screen);
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
  console.log(result);
}

exampleAsyncFunction();