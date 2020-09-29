const gridSize = 4;
const bdColor = '#b4c7e6';
const cellSpace = 20;
const cellWidth = 100;
var score = 0;

//Model
class Game {
    constructor() {
        this.data = [];
        this.initData();
    }


    initData() {
        this.data = [];   //清空数据
        // 创建二维数组
        for (let i = 0; i < gridSize; i++) {
            this.data[i] = [];
            for (let j = 0; j < gridSize; j++) {
                this.data[i][j] = null;
            }
        }

        this.produceRandomCell();
        this.produceRandomCell();
    }

    produceRandomCell() {
        if (this.isFree()) {
            let freePosition = [];        // 找出所有的空格子并记录其位置
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (this.data[i][j] == null) {
                        freePosition.push([i, j]);
                    }
                }
            }
            let rdmPosition = this.rdmOfArr(freePosition);   //随机取出其中一个空格子
            this.data[rdmPosition[0]][rdmPosition[1]] = this.rdmNum(1, 2) * 2;   //在随机的空格子中随机产生数字2或4
        }
    }

    isFree() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (this.data[i][j] == null) {
                    return true;
                }
            }
        }
        return false;
    }

    rdmNum(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    rdmOfArr(arr) {
        return arr[this.rdmNum(0, arr.length - 1)];
    }

    operation(code) {
        let reverse = (code == 39 || code == 40) ? true : false;
        let moveCells = [];
        if (code == 37 || code == 39) {
            let rowMoves = [];
            for (let i = 0; i < gridSize; i++) {
                rowMoves = this.updateData(this.data[i], reverse);
                for (let move of rowMoves) {
                    moveCells.push([[i, move[0]], [i, move[1]]]);
                }
            }

        }

        if (code == 38 || code == 40) {
            let rowMoves = [];
            for (let j = 0; j < gridSize; j++) {
                let tmp = [];
                for (let i = 0; i < gridSize; i++) {
                    tmp[i] = this.data[i][j];
                }
                rowMoves = this.updateData(tmp, reverse);
                for (let move of rowMoves) {
                    moveCells.push([[move[0], j], [move[1], j]])
                }
                for (let i = 0; i < gridSize; i++) {
                    this.data[i][j] = tmp[i];
                }
            }
        }

        if (moveCells.length > 0) {
            this.produceRandomCell();
        }

    }


    updateData(arr, reverse = false) {
        let head = 0;
        let tail = 1;
        let delta = 1;
        let moveCells = [];
        if (reverse == true) {
            head = arr.length - 1;
            tail = head - 1;
            delta = -1;
        }
        while (tail >= 0 && tail < arr.length) {
            if (arr[tail] == null) {
                tail += delta;
            } else if (arr[head] == null) {
                arr[head] = arr[tail];
                arr[tail] = null;
                moveCells.push([tail, head]);
                tail += delta;
            } else if (arr[head] == arr[tail]) {
                arr[head] *= 2;
                arr[tail] = null;
                moveCells.push([tail, head]);
                score += arr[head];
                head += delta;
                tail += delta;
            } else {
                head += delta;
                if (head == tail) {
                    tail += delta;
                }
            }
        }
        return moveCells;
    }

    gameover() {
        let isover = true;
        if (this.isFree() == false) {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    let judgment1 = (i == 0) && (j != 0) && (this.data[i][j] == this.data[i][j - 1]);
                    let judgment2 = (i != 0) && (j == 0) && (this.data[i][j] == this.data[i - 1][j]);
                    let judgment3 = (i != 0) && (j != 0) && (this.data[i][j] == this.data[i - 1][j] || this.data[i][j] == this.data[i][j - 1]);
                    if (judgment1 || judgment2 || judgment3) {
                        isover = false;
                    }
                }
            }
        } else {
            isover = false;
        }
        return isover;
    }

}



//View
class View {
    constructor(game, container) {
        this.game = game;
        this.container = container;
        this.initGrid();
        this.showScore();
    }
    initGrid() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                this.createCell(i, j, bdColor);
            }
        }
    }

    // 绘制单元格
    createCell(i, j, color) {
        let cell = document.createElement('div');
        cell.style.backgroundColor = color;
        cell.className = 'cell-' + i + '-' + j;
        cell.style.top = this.abslutPos(i, j)[0] + 'px';
        cell.style.left = this.abslutPos(i, j)[1] + 'px';
        this.container.append(cell);
        return cell;
    }

    showNumCell() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let cells = document.querySelectorAll('.cell-' + i + '-' + j);    //创建新的格子之前景色之前先清除所有具有前景色的格子
                cells[0].style.zIndex = 0;
                if (cells.length > 1) {
                    for (let k = 1; k < cells.length; k++) {
                        cells[k].parentNode.removeChild(cells[k]);
                    }
                }
                if (this.game.data[i][j]) {
                    this.createNumCell(i, j, this.game.data[i][j]);
                }
            }
        }
    }


    //设置单元格上的数字以及对应的前景色
    createNumCell(i, j, number) {
        let span = document.createElement("span");
        let numCell = this.createCell(i, j, this.fdColor(this.game.data[i][j]));
        span.innerHTML = number;
        numCell.append(span);
    }


    fdColor(number) {
        switch (number) {
            case 2: return '#a7a7ff'; break;
            case 4: return '#8c8dc8'; break;
            case 8: return '#7373af'; break;
            case 16: return '#5b63ad'; break;
            case 32: return '#7476ff'; break;
            case 64: return '#5c64ff'; break;
            case 128: return '#697dff'; break;
            case 256: return '#55aaff'; break;
            case 512: return '#5061ff'; break;
            case 1024: return '#455eff'; break;
            case 2048: return '#4e7dff'; break;
            default: return '#87b4fc';break;

        }
    }


    abslutPos(i, j) {
        let top = cellSpace + (cellSpace + cellWidth) * i;
        let left = cellSpace + (cellSpace + cellWidth) * j;
        return [top, left];
    }

    showScore() {
        let span = document.querySelector('.score span');
        span.innerHTML = score;
    }

    showGameOver() {
        // let mask = document.querySelector('.mask');
        var gameover = document.querySelector('.gameOver');
        if (this.game.gameover() == true) {
            // mask.style.display = 'block';
            gameover.style.display = 'block';
        }
    }

    newGame() {
        this.game.initData();
        this.showNumCell();
        // let mask = document.querySelector('.mask');
        let gameover = document.querySelector('.gameOver');
        // mask.style.display = 'none';
        gameover.style.display = 'none';

    }
}

//Controller
var container = document.querySelector('.game-container');
var btns = document.querySelectorAll('button');
console.log(btns.length);
var game = new Game();
var view = new View(game, container);
view.showNumCell();
document.onkeydown = function (e) {
    moveCells = game.operation(e.keyCode);
    view.showNumCell();
    view.showScore();
    view.showGameOver();
}
for (let i = 0; i < btns.length; i++) {
    btns[i].onclick = function () {
        view.newGame();
    }
}









