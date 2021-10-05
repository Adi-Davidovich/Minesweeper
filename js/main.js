'use strict'

const MINE = '💣';
const FLAG = '🚩';
const FLOWER = '🌸';

var gBoard;

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    isWin: null,
    correctCount: 0,
    markedCount: gLevel.MINES,
    secsPassed: 0,
    lives: 3
}

var gIntervalSec;


function init() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    renderElement('.smiley', '😃')
    clearInterval(gIntervalSec);
    gGame.isOn = true;
    gGame.isWin = null;
    gGame.correctCount = 0;
    gGame.lives = 3;
    gGame.secsPassed = 0;
    renderElement('.clock', gGame.secsPassed);
    gGame.markedCount = gLevel.MINES;
    renderElement('.flag', gGame.markedCount);
}


function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
            board[i][j] = cell;
        }
    }
    return board;
}


function cellClicked(e, i, j) {
    var cell = gBoard[i][j];
    var elCell = e.target;
    if (!gGame.isOn) return;
    if (cell.isShown) return;
    if (cell.isMarked) return;
    if (gGame.correctCount === 0) {
        updateSec()
        addMines(gBoard, i, j);
        setMinesNegsCount(gBoard);
    }
    cell.isShown = true;
    elCell.classList.remove('hide')
    if (cell.isMine) {
        renderCell({ i: i, j: j }, MINE);
        gGame.lives--;
        if (gGame.lives === 2){
            document.querySelector('.two').classList.add('black');
        }
        if (gGame.lives === 1){
            document.querySelector('.one').classList.add('black');
        }
        if (!gGame.lives){
            elCell.classList.add('red');
            document.querySelector('.zero').classList.add('black');
            gGame.isWin = false;
            checkGameOver();
        }
    } else {
        gGame.correctCount++;
        renderCell({ i: i, j: j }, cell.minesAroundCount);
        if (!cell.minesAroundCount) {
            expandShown(gBoard, e, i, j);
            renderCell({ i: i, j: j }, '');
        }
    }

    if (gGame.correctCount === gLevel.SIZE ** 2 - gLevel.MINES) {
        gGame.isWin = true;
        checkGameOver();
    }
}


function cellMarked(e, i, j) {
    e.preventDefault()
    var cell = gBoard[i][j];
    var elCell = document.querySelector(`.cell${i}-${j}`);
    if (!gGame.isOn) return;
    if (cell.isShown) return;

    if (elCell.innerHTML === FLAG) {
        elCell.innerHTML = '';
        cell.isMarked = false;
        gGame.markedCount++;
        renderElement('.flag', gGame.markedCount);
    } else {
        if (!gGame.markedCount) return;
        elCell.innerHTML = FLAG;
        cell.isMarked = true;
        gGame.markedCount--;
        renderElement('.flag', gGame.markedCount);
    }
}



function expandShown(board, ev, iClicked, jClicked) {

    for (var i = iClicked - 1; i <= iClicked + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = jClicked - 1; j <= jClicked + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === iClicked && j === jClicked) continue;
            var cell = board[i][j];
            var elCell = document.querySelector(`.cell${i}-${j}`);
            if (cell.isMarked) continue;
            if (cell.minesAroundCount) {
                renderCell({ i: i, j: j }, cell.minesAroundCount);
            } else {
                renderCell({ i: i, j: j }, '');
            }
            if (!cell.isShown) gGame.correctCount++;
            cell.isShown = true;
            elCell.classList.remove('hide');
        }
    }
}


function addMines(board, iClicked, jClicked) {
    for (var idx = 0; idx < gLevel.MINES; idx++) {
        var i = getRandomInt(0, gLevel.SIZE);
        var j = getRandomInt(0, gLevel.SIZE);
        while (i === iClicked && j === jClicked || board[i][j].isMine) {
            i = getRandomInt(0, gLevel.SIZE);
            j = getRandomInt(0, gLevel.SIZE);
        }
        board[i][j].isMine = true;
        document.querySelector(`.cell${i}-${j}`).classList.add('mine');
    }
}


function setMinesNegsCount(board) {
    for (var rowIdx = 0; rowIdx < board.length; rowIdx++) {
        for (var colIdx = 0; colIdx < board[0].length; colIdx++) {
            var mineCount = 0;
            for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
                if (i < 0 || i > board.length - 1) continue
                for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                    if (j < 0 || j > board[0].length - 1) continue
                    if (i === rowIdx && j === colIdx) continue
                    var cell = board[i][j];
                    if (cell.isMine) mineCount++;
                    board[rowIdx][colIdx].minesAroundCount = mineCount;
                }
            }
        }
    }
}


function setLevel(size) {
    if (size === 4) {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
    }
    else if (size === 8) {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
    }
    else if (size === 12) {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
    }
    init()
}


function renderBoard(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = `cell cell${i}-${j} hide`;
            strHTML += `<td oncontextmenu="cellMarked(event, ${i}, ${j})" 
            class="${className}" onclick="cellClicked(event, ${i}, ${j})"> 
            </td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    renderElement('.table-container', strHTML);
}


function checkGameOver() {
    gGame.isOn = false;
    clearInterval(gIntervalSec);
    if (gGame.isWin) {
        renderElement('.smiley', '😎');
        revealMines(FLOWER);
    }
    else {
        renderElement('.smiley', '😭');
        revealMines(MINE);
    }
}


function revealMines(value) {
    var elMines = document.querySelectorAll('.hide.mine');
    for (var i = 0; i < elMines.length; i++) {
        elMines[i].classList.remove('hide');
        elMines[i].innerHTML = value;
    }
}


function updateSec() {
    gIntervalSec = setInterval(function () {
        gGame.secsPassed++;
        renderElement('.clock', gGame.secsPassed);
    }, 1000);
}
