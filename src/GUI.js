export var myC = {
    white: '0xFFFFFF',
    red: '0xFF0000',
    blue: '0x011EFE',
    yellow: '0xFDFE02',
    pink: '0xFE00F6',
    pPink: '0xFF71CE',
    pBlue: '0x01CDFE',
    green: '0x21D326',
    grey: '0x9B9B9B',
    lGrey: '0xCDCDCD',
};

export var Pixel = /** @class */ (function () {
    function Pixel(R, C, color, bar, hexGrid) {
        var _this = this;
        this.size = 100;
        this.parentGrid = hexGrid;
        this.size = this.parentGrid.getAppScreen().width / 20;
        this.row = R;
        this.col = C;
        this.color = color;
        this.graphics = new PIXI.Graphics();
        this.graphics.tint = color;
        this.bar = bar;
        this.graphics.x = this.size * 1.5 * (C + (R % 2) / 2);
        this.graphics.y = this.size * 1.3 * R;
        this.graphics.interactive = true;
        this.drawHex();
        this.graphics.onclick = function () {
            //function here that happens on click
            _this.pixelClicked(_this);
        };
        this.graphics.on('wheel', this.handleMouseWheel.bind(this));
        this.graphics.on('mousedown', function (event) {
            _this.parentGrid.setIsDragging(true, event.data.global.x, event.data.global.y);
        });
        this.graphics.on('mouseup', function () {
            _this.parentGrid.setIsDragging(false, 0, 0);
        });
        this.graphics.on('mousemove', function (event) {
            if (_this.parentGrid.getIsDragging()) {
                _this.bar.setSelection(0);
                _this.parentGrid.moveGrid(event.data.global.x - _this.parentGrid.getDragPos().x, event.data.global.y - _this.parentGrid.getDragPos().y);
                _this.parentGrid.setIsDragging(true, event.data.global.x, event.data.global.y);
            }
        });
    }
    Pixel.prototype.handleMouseWheel = function (event) {
        this.parentGrid.zoomGrid(-event.deltaY, this.row, this.col);
    };
    Pixel.prototype.drawHex = function () {
        this.graphics.beginFill(0xFFFFFF); // Fill color (red in this example)
        this.graphics.lineStyle(2, 0x000000); // Line style (black border in this example)
        var numberOfSides = 6;
        var stepAngle = (2 * Math.PI) / numberOfSides;
        var radius = this.size * Math.sqrt(3) / 2; // Circumradius for a regular hexagon
        // Move to the first point
        this.graphics.moveTo(radius * Math.cos(-Math.PI / 6), radius * Math.sin(-Math.PI / 6));
        // Draw the hexagon with rotated angles
        for (var i = 1; i <= numberOfSides; i++) {
            var angle = -Math.PI / 6 + stepAngle * i;
            this.graphics.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        }
        this.graphics.closePath(); // Connect the last point to the first point to close the shape
        this.graphics.endFill();
    };
    Pixel.prototype.pixelClicked = function (p) {
        //console.log("row: ", row, " col: ", col, " clicked")
        switch (this.bar.getSelection()) {
            case 1:
                p.changeColor(myC.pPink);
                break;
            case 2:
                p.changeColor(myC.pBlue);
                break;
            case 3:
                p.changeColor(myC.green);
                break;
            case 4:
                p.changeColor(myC.red);
                break;
            case 5:
                p.changeColor(myC.grey);
                break;
            default:
                console.log("Invalid selectionStatus.");
                break;
        }
    };
    Pixel.prototype.changeColor = function (color) {
        this.color = color;
        this.graphics.tint = color;
    };
    Pixel.prototype.getGraphics = function () {
        return this.graphics;
    };
    return Pixel;
}());
//class for hex grid
export var HexGrid = /** @class */ (function () {
    function HexGrid(board_data, bar, appScreen) {
        this.pixels = [];
        this.grid = new PIXI.Container();
        this.isDragging = false;
        this.dragPos = {
            x: 0,
            y: 0
        };
        this.minScale = 0.1;
        this.maxScale = 5;
        this.zoomSpeed = 0.1; // Adjust this value to control zoom speed
        this.bar = bar;
        this.appScreen = appScreen;
        this.grid.x = 100;
        this.grid.y = 100;
  
        this.rows = board_data.length
        this.cols = board_data[0].length
      
        for (var row = 0; row < this.rows; row++) {
            this.pixels[row] = [];
            for (var col = 0; col < this.cols; col++) {
                var newObject = new Pixel(row, col, myC.lGrey, this.bar, this);
                this.grid.addChild(newObject.getGraphics());
                this.pixels[row][col] = newObject;
            }
        }
    }
    HexGrid.prototype.zoomGrid = function (wheelDelta, row, col) {
        // Calculate the new scale based on the wheel delta
        var newScale = this.grid.scale.x + wheelDelta * this.zoomSpeed * 0.008;
        // Limit the scale to the minScale and maxScale values
        newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
        // Update the scale of the 'board' container
        this.grid.scale.set(newScale);
        var adjustmentFactor = wheelDelta / 17000;
        this.grid.x -= col * this.appScreen.width * adjustmentFactor;
        this.grid.y -= row * this.appScreen.height * adjustmentFactor;
        console.log("scrolled ", row, col, wheelDelta);
    };
    HexGrid.prototype.moveGrid = function (deltaX, deltaY) {
        this.grid.x += deltaX;
        this.grid.y += deltaY;
    };
    HexGrid.prototype.setIsDragging = function (isDragging, x, y) {
        this.isDragging = isDragging;
        this.dragPos.x = x;
        this.dragPos.y = y;
    };
    HexGrid.prototype.getIsDragging = function () {
        return this.isDragging;
    };
    HexGrid.prototype.getDragPos = function () {
        return this.dragPos;
    };
    HexGrid.prototype.getAppScreen = function () {
        return this.appScreen;
    };
    HexGrid.prototype.getGrid = function () {
        return this.grid;
    };
    return HexGrid;
}());

//class for mask
export var Mask = /** @class */ (function () {
    function Mask(appScreen, grid) {
        var _this = this;
        this.mask = new PIXI.Container();
        this.appScreen = appScreen;
        this.grid = grid;
        var outerRect = new PIXI.Graphics();
        outerRect.beginFill(myC.grey); // Red color for the outer rectangle
        outerRect.drawRect(0, 0, this.appScreen.width, this.appScreen.height);
        outerRect.endFill();
        outerRect.beginHole();
        outerRect.drawRect(100, 100, this.appScreen.width - 200, this.appScreen.height - 300);
        outerRect.endHole();
        this.mask.addChild(outerRect);
        //when mouse on, stop board movement
        outerRect.interactive = true;
        outerRect.on('mouseenter', function () {
            _this.grid.setIsDragging(false, 0, 0);
        });
    }
    Mask.prototype.getMask = function () {
        return this.mask;
    };
    return Mask;
}());
//class for hitbox
export var Hitbox = /** @class */ (function () {
    function Hitbox(appScreen, grid) {
        var _this = this;
        this.hitbox = new PIXI.Container();
        this.appScreen = appScreen;
        this.grid = grid;
        var rect = new PIXI.Graphics();
        rect.beginFill(myC.white, 0.01);
        rect.drawRect(100, 100, this.appScreen.width - 200, this.appScreen.height - 300);
        this.hitbox.addChild(rect);
        this.hitbox.interactive = true;
        //when mouse on, stop board movement
        this.hitbox.on('mouseenter', function () {
            _this.grid.setIsDragging(false, 0, 0);
        });
    }
    Hitbox.prototype.getHitbox = function () {
        return this.hitbox;
    };
    return Hitbox;
}());
//class for bar
export var Bar = /** @class */ (function () {
    function Bar(appScreen) {
        var _this = this;
        this.bar = new PIXI.Container();
        this.selectionStatus = 0;
        this.appScreen = appScreen;
        this.bar.x = this.appScreen.width * 0.1;
        this.bar.y = this.appScreen.height * 0.8;
        this.select = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.select.tint = 0xFFFF00; // Yellow color for the select sprite
        this.select.anchor.set(0.05, 0.05);
        this.select.visible = false;
        this.team1 = new PIXI.Sprite(PIXI.Texture.from("./static/team select.png"));
        this.team1.tint = myC.pPink; // Pink color for team1 icon
        this.team2 = new PIXI.Sprite(PIXI.Texture.from("./static/team select.png"));
        this.team2.tint = myC.pBlue; // Blue color for team2 icon
        this.heart = new PIXI.Sprite(PIXI.Texture.from("./static/heart-plus.png"));
        this.fire = new PIXI.Sprite(PIXI.Texture.from("./static/fire.png"));
        this.wall = new PIXI.Sprite(PIXI.Texture.from("./static/defensive-wall.png"));
        this.select.width = this.appScreen.width * 0.11;
        this.select.height = this.appScreen.width * 0.11;
        this.team1.width = this.appScreen.width * 0.1;
        this.team1.height = this.appScreen.width * 0.1;
        this.team2.width = this.appScreen.width * 0.1;
        this.team2.height = this.appScreen.width * 0.1;
        this.heart.width = this.appScreen.width * 0.1;
        this.heart.height = this.appScreen.width * 0.1;
        this.fire.width = this.appScreen.width * 0.1;
        this.fire.height = this.appScreen.width * 0.1;
        this.wall.width = this.appScreen.width * 0.1;
        this.wall.height = this.appScreen.width * 0.1;
        this.team2.x = this.team1.width * 1.2;
        this.heart.x = this.team1.width * 4.6;
        this.fire.x = this.team1.width * 5.8;
        this.wall.x = this.team1.width * 7;
        this.bar.addChild(this.select, this.team1, this.team2, this.heart, this.fire, this.wall);
        this.team1.interactive = true;
        this.team2.interactive = true;
        this.heart.interactive = true;
        this.fire.interactive = true;
        this.wall.interactive = true;
        this.team1.on("click", function () { return _this.changeStatus(1); });
        this.team2.on("click", function () { return _this.changeStatus(2); });
        this.heart.on("click", function () { return _this.changeStatus(3); });
        this.fire.on("click", function () { return _this.changeStatus(4); });
        this.wall.on("click", function () { return _this.changeStatus(5); });
    }
    Bar.prototype.changeStatus = function (choice) {
        if (choice === this.selectionStatus) {
            this.selectionStatus = 0;
            this.select.visible = false;
        }
        else {
            this.selectionStatus = choice;
        }
        switch (this.selectionStatus) {
            case 1:
                this.select.x = 0;
                this.select.visible = true;
                break;
            case 2:
                this.select.x = this.team1.width * 1.2;
                this.select.visible = true;
                break;
            case 3:
                this.select.x = this.team1.width * 4.6;
                this.select.visible = true;
                break;
            case 4:
                this.select.x = this.team1.width * 5.8;
                this.select.visible = true;
                break;
            case 5:
                this.select.x = this.team1.width * 7;
                this.select.visible = true;
                break;
            default:
                console.log("Invalid selection.");
                break;
        }
    };
    Bar.prototype.getBar = function () {
        return this.bar;
    };
    Bar.prototype.setSelection = function (selection) {
        this.selectionStatus = selection;
        this.changeStatus(selection);
    };
    Bar.prototype.getSelection = function () {
        return (this.selectionStatus);
    };
    return Bar;
}());
