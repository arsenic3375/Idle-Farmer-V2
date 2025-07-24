class Cell {
    constructor(grid, x, y) {
        this.grid = grid
        this.x = x;
        this.y = y;
        this.tile = new Grass(this);

        this.img = document.createElement("img");
        this.div = document.createElement("div");
        this.div.style.setProperty("--x", x);
        this.div.style.setProperty("--y", y);
        this.div.classList.add("cell");
        this.div.appendChild(this.img);
        this.div.addEventListener('click', (event) => {
            this.setTile(new Wheat(this));
            console.log(this);
        });
    }

    addEventListener(eventListener) {
        this.eventListeners.push(eventListener);
    }

    dispatch(event) { 
        this.eventListeners.forEach((eventListener) => {
            if(eventListener.type === event.type) {
                eventListener.listener(event.detail); 
            }
        }); 
    }

    update() {
        this.tile.update();
        this.img.src = "sprites/"+this.tile.name+"/"+this.tile.position+".png";
    }

    setTile(tile) {
        this.tile = tile;
        this.grid.setNeighborhood(this.tile.home, this.tile.neighborhood);
    }
}

class Tile {
    constructor(name, home) {
        this.name = name;
        this.type = "";

        this.orientation = "";
        this.position = "11111111";
        this.state = "";

        this.home = home;
        this.neighborhood = [];
    }

    update() {}
}

class Grass extends Tile {
    constructor(home) {
        super("grass", home);
        this.neighborhood = [[home]];
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
        for(let i = 0; i < this.neighborhood.length; i++) {
            for(let j = 0; j < this.neighborhood[i].length; j++) {
                    if(this.neighborhood[i][j].tile.name == this.home.tile.name) {
                        position.push(1);
                    }
                    else {
                        position.push(0);
                    }
                }
        }
        
        if(position[1] == 0) {
            position[0] = 0;
            position[2] = 0;
        }
        if(position[3] == 0) {
            position[0] = 0;
            position[6] = 0;
        }
        if(position[5] == 0) {
            position[2] = 0;
            position[8] = 0;
        }
        if(position[7] == 0) {
            position[6] = 0;
            position[8] = 0;
        }
        
        position.splice(4, 1);
        this.position = position.join("");
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