'use strict'

const MINE = '💣';


var gBoard;

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function init() {
    gBoard = buildBoard();
    console.table(gBoard);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
            if (i === 2 && j === 1) cell.isMine = true;
            if (i === 3 && j === 3) cell.isMine = true;

            board[i][j] = cell;
        }
    }
    return board;
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
                    // console.log('cell :>> ', cell);
                    // console.log('mineCount :>> ', mineCount);
                }
            }
            // console.log('rowIdx :', rowIdx , 'colIdx :', colIdx)
            // console.log('board[rowIdx][colIdx]', board[rowIdx][colIdx]);
        }
    }
}



function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    cell.isShown = true;
    elCell.classList.remove('hide');
    if (cell.isMine){
        renderCell({i: i, j: j}, MINE)
    }else {
        renderCell({i: i, j: j}, cell.minesAroundCount);
        if (!cell.minesAroundCount) renderCell({i: i, j: j}, '');
    }
}



function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = `cell cell${i}-${j} hide`;
            className += (cell.isMine) ? 'mine' : '';
            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})" >`

            // if (cell.isMine) {
            //     strHTML += MINE;
            // }else {
            //     strHTML += cell.minesAroundCount;
            // }

            strHTML += '</td>';
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
    console.log('strHTML :>> ', strHTML);
}