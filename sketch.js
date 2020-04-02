const con = require('electron').remote.getGlobal('console');
const cv = require('../js_libs/opencv')

var canvas;
var grid;
var next;
const rows = 200;
const cols = 200;
const height = rows;
const width = cols;
var dA = 1;
var dB = 0.5;
var feed = 0.0367;
var k = 0.0649;

class Point {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    pixelDensity(1);
    grid = [];
    next = [];
    for (var x = 0; x < rows; ++x) {
        grid[x] = [];
        next[x] = [];
        for (var y = 0; y < cols; ++y) {
            grid[x][y] = new Point(1, 0);
            next[x][y] = new Point(0, 0);
        }
    }
    //create random lines
    var count = 100;
    while (count > 0) {
        grid[floor(random(1) * 200)][floor(random(1) * 200)].b = random(0.5) + 0.5;
        count--;
    }

    // var length = 50;
    // for (var i = 0; i < 50; ++i) {
    //     grid[100][i + 50].b = random(0.5) + 0.5; 
    // }
}

function draw() {
    loadPixels();
    for (var x = 0; x < width; ++x) {
        for (var y = 0; y < height; ++y) {
            let a = grid[x][y].a;
            let b = grid[x][y].b;
            next[x][y].a = a + (dA * laplace("a", x, y) - a * b * b + feed * (1 - a));
            next[x][y].b = b + (dB * laplace("b", x, y) + a * b * b - (k + feed) * b);
        }
    }
    for (var x = 0; x < width; ++x) {
        for (var y = 0; y < height; ++y) {
            var pixIndex = 4 * (y * width + x);
            pixels[pixIndex + 0] = floor(next[x][y].a * 255);
            pixels[pixIndex + 1] = 0;
            pixels[pixIndex + 2] = floor(next[x][y].b * 255);
            pixels[pixIndex + 3] = 255;
            grid[x][y].a = next[x][y].a;
            grid[x][y].b = next[x][y].b;
        }
    }
    updatePixels();
}

function laplace(variable, x, y) {
    var sum = 0;
    if (variable == "a") {
        sum += grid[x][y].a * -1;
        if (x > 0) {
            sum += grid[x - 1][y].a * 0.2;
            if (y > 0) {
                sum += grid[x - 1][y - 1].a * 0.05;
            }
            if (y < cols - 1) {
                sum += grid[x - 1][y + 1].a * 0.05;
            }
        }
        if (y < cols - 1) {
            sum += grid[x][y + 1].a * 0.2;
        }
        if (y > 0) {
            sum += grid[x][y - 1].a * 0.2;
        }
        if (x < rows - 1) {
            sum += grid[x + 1][y].a * 0.2;
            if (y > 0) {
                sum += grid[x + 1][y - 1].a * 0.05;
            }
            if (y < cols - 1) {
                sum += grid[x + 1][y + 1].a * 0.05;
            }
        }
    }
    else {
        sum += grid[x][y].b * -1;
        if (x > 0) {
            sum += grid[x - 1][y].b * 0.2;
            if (y > 0) {
                sum += grid[x - 1][y - 1].b * 0.05;
            }
            if (y < cols - 1) {
                sum += grid[x - 1][y + 1].b * 0.05;
            }
        }
        if (y < cols - 1) {
            sum += grid[x][y + 1].b * 0.2;
        }
        if (y > 0) {
            sum += grid[x][y - 1].b * 0.2;
        }
        if (x < rows - 1) {
            sum += grid[x + 1][y].b * 0.2;
            if (y > 0) {
                sum += grid[x + 1][y - 1].b * 0.05;
            }
            if (y < cols - 1) {
                sum += grid[x + 1][y + 1].b * 0.05;
            }
        }
    }
    return sum;
}