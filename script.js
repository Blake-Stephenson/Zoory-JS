import { HexGrid, Mask, Bar, Hitbox } from "./src/GUI.js";

var board_data = [];
for (let i = 0; i < 100; i++) {
      const row = [];
      for (let j = 0; j < 100; j++) {
          row.push(0); // Fill each cell with 0 (or any other value you want)
      }
      board_data.push(row);
  }
var loadedDB = false;

//fetch board data from server
fetch("https://zoory-db.epicblake8.repl.co/board")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Process the response data

    console.log(data);
    board_data = data.table;
    loadedDB = true;
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });

//make the gui

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
grid.reloadGrid(board_data)
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

function resolveAfterDelay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Resolved after ${delay} milliseconds`);
    }, delay);
  });
}

async function startGame() {
  console.log('Before await**');
  const result = await resolveAfterDelay(2000); // The function will pause here until the promise is resolved.
  if (loadedDB = false) {
    console.log("no db connect")
  }


  console.log(result);
};

startGame();
console.log("new")

function updateBoard() {
  fetch("https://zoory-db.epicblake8.repl.co/board")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Process the response data

    //console.log(data);
    board_data = data.table;
    loadedDB = true;
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
  grid.reloadGrid(board_data);
};

setInterval(updateBoard, 1000);
