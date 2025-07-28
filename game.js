class Cell {
    constructor(grid, x, y) {
        this.grid = grid
        this.x = x;
        this.y = y;
        this.tile = new Grass(this);

        this.div = document.createElement("div");
        this.div.style.setProperty("--x", x);
        this.div.style.setProperty("--y", y);
        this.div.classList.add("cell");
        this.div.addEventListener('click', (event) => {
            this.setTile(new Wheat(this));
            console.log(this);
        });

        this.div.appendChild(this.tile.tileDiv);
        this.div.appendChild(this.tile.subtilesDiv);
    }

    update() {
        this.tile.update();
    }

    setTile(tile) {
        this.tile = tile;
        this.grid.setNeighborhood(this.tile.home, this.tile.neighborhood);

        this.div.innerHTML = ""; 
        
        this.div.appendChild(this.tile.tileDiv);
        this.div.appendChild(this.tile.subtilesDiv);
    }
}

class Subtile {
    constructor(name, position) {
        this.name = name;
        this.type = "connection";
        this.position = position;

        this.img = document.createElement("img");
        this.div = document.createElement("div");
        this.div.appendChild(this.img);
    }

    update() {
        this.img.src = "sprites/"+this.name+"/"+this.position+"/"+this.type+".png";
    }
}

class Center extends Subtile {
    constructor(name, position) {
        super(name, position);
        this.div.classList.add("center");
        this.div.appendChild(this.img);
    }
}

class Edge extends Subtile {
    constructor(name, position) {
        super(name, position);
        this.div.classList.add("edge");

        if(this.position == "top" || this.position == "bottom") {
            this.div.classList.add("horizontal");
        }

        if(this.position == "left" || this.position == "right") {
            this.div.classList.add("vertical");
        }
    }
}

class Corner extends Subtile {
    constructor(name, position) {
        super(name, position);
        this.div.classList.add("corner");
    }
}

class Tile {
    constructor(name, home) {
        this.subtiles = [[new Corner("fence", "top-left"), new Edge("fence", "top"), new Corner("fence", "top-right")],
                         [new Edge("fence", "left"), new Center("fence", "center"), new Edge("fence", "right")],
                         [new Corner("fence", "bottom-left"), new Edge("fence", "bottom"), new Corner("fence", "bottom-right")]];

        this.name = name;
        this.type = "";

        this.orientation = "";
        this.position = "11111111";
        this.state = "base";

        this.home = home;
        this.neighborhood = [];

        this.img = document.createElement("img");
        this.tileDiv = document.createElement("div");
        this.tileDiv.classList.add("tile")
        this.tileDiv.appendChild(this.img)

        this.subtilesDiv = document.createElement("div");
        this.subtilesDiv.classList.add("subtiles")
        
        for(let i = 0; i < this.subtiles.length; i++) {
            for(let j = 0; j < this.subtiles[i].length; j++) {
                this.subtilesDiv.appendChild(this.subtiles[i][j].div);
            }
        }
    }

    update() {}
}

class Grass extends Tile {
    constructor(home) {
        super("grass", home);
        this.neighborhood = [[home]];
    }

    update() {
        this.img.src = "sprites/"+this.name+"/"+this.state+".png";

        for(let i = 0; i < this.subtiles.length; i++) {
            for(let j = 0; j < this.subtiles[i].length; j++) {
                this.subtiles[i][j].update();
            }
        }
    }
}

class Wheat extends Tile {
    constructor(home) {
        super("wheat", home);
        this.neighborhood = [
            [new Cell(), new Cell(), new Cell()],
            [new Cell(), home, new Cell()],
            [new Cell(), new Cell(), new Cell()]
        ];
    }

    update() {
        let position = [];
        let neighborhood = this.neighborhood.flat()
        let subtiles = this.subtiles.flat();

        neighborhood.forEach((neighbor) => {
            if(neighbor.tile.name == this.name) {
                    position.push(1);
                }
                else {
                    position.push(0);
                }
        });

        if(position[0] == 0) {
            subtiles[0].type = "inverted-corner"
        }
        else {
            subtiles[0].type = "connection"
        }
        
        if(position[2] == 0) {
            subtiles[2].type = "inverted-corner"
        }
        else {
            subtiles[2].type = "connection"
        }

        if(position[6] == 0) {
            subtiles[6].type = "inverted-corner"
        }
        else {
            subtiles[6].type = "connection"
        }

        if(position[8] == 0) {
            subtiles[8].type = "inverted-corner"
        }
        else {
            subtiles[8].type = "connection"
        }


        if(position[1] == 0) {
            position[0] = 0;
            position[2] = 0;
            
            subtiles[0].type = "horizontal"
            subtiles[1].type = "barrier"
            subtiles[2].type = "horizontal"
        }
        else {
            subtiles[1].type = "connection"
        }

        if(position[3] == 0) {
            position[0] = 0;
            position[6] = 0;
            
            subtiles[0].type = "vertical"
            subtiles[3].type = "barrier"
            subtiles[6].type = "vertical"
        }
        else {
            subtiles[3].type = "connection"
        }

        if(position[5] == 0) {
            position[2] = 0;
            position[8] = 0;
            
            subtiles[2].type = "vertical"
            subtiles[5].type = "barrier"
            subtiles[8].type = "vertical"
        }
        else {
            subtiles[5].type = "connection"
        }

        if(position[7] == 0) {
            position[6] = 0;
            position[8] = 0;
            
            subtiles[6].type = "horizontal"
            subtiles[7].type = "barrier"
            subtiles[8].type = "horizontal"
        }
        else {
            subtiles[7].type = "connection"
        }


        if(position[1] == 0 && position[3] == 0) {
            subtiles[0].type = "corner"
        }

        if(position[1] == 0 && position[5] == 0) {
            subtiles[2].type = "corner"
        }

        if(position[7] == 0 && position[3] == 0) {
            subtiles[6].type = "corner"
        }

        if(position[7] == 0 && position[5] == 0) {
            subtiles[8].type = "corner"
        }
        
        
        position.splice(4, 1);
        this.position = position.join("");

        this.img.src = "sprites/"+this.name+"/"+this.state+".png";

        subtiles.forEach((subtile) => { subtile.update() });
    }
}

class Grid {
    constructor(s, rows, cols) {
        this.div = document.getElementById("grid");
        this.arr = [];

        this.div.innerHTML = "";
        this.div.style.setProperty("--s", s);
        this.div.style.setProperty("--cols", cols);
        this.div.style.setProperty("--rows", rows);
        this.fillGrid(rows, cols);
    }

    fillGrid(rows, cols) {
        this.arr = []; 
        for(let i = 0; i < rows; i++) {
            this.arr[i] = [];
            for(let j = 0; j < cols; j++) {
                /*
                let cell = document.createElement("div");
                cell.style.setProperty("--x", j);
                cell.style.setProperty("--y", i);
                cell.classList.add("cell");
                cell.addEventListener('click', (event) => {
                    let x = parseInt(window.getComputedStyle(cell).getPropertyValue("--x"));
                    let y = parseInt(window.getComputedStyle(cell).getPropertyValue("--y"));
                    console.log(`(${x}, ${y})`);
                });
                */

                let cell = new Cell(this, j, i);
                this.arr[i][j] = cell
                this.div.appendChild(cell.div);
            }
        }
    }

    setNeighborhood(home, neighborhood) {
        let offset_x, offset_y;
        for(let i = 0; i < neighborhood.length; i++) {
            for(let j = 0; j < neighborhood[i].length; j++) {
                if(neighborhood[i][j] == home) {
                    offset_y = i;
                    offset_x = j;
                }
            }
        }

        for(let i = 0; i < neighborhood.length; i++) {
            for(let j = 0; j < neighborhood[i].length; j++) {
                neighborhood[i][j] = this.arr[i-offset_y+home.y][j-offset_x+home.x];
            }
        }
    }

    update() {
        for(let i = 0; i < this.arr.length; i++) {
            for(let j = 0; j < this.arr[i].length; j++) {
                this.arr[i][j].update();
            }
        }
    }
}

grid = new Grid(32, 10, 10);


function update() {
    grid.update();
    requestAnimationFrame(update);
}

update();