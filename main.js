var visualBoard = document.querySelectorAll('.square');
var visualBoardImages = document.querySelectorAll('.imgSquare');
var virtualBoard;

var gameStatus = document.getElementById('gameStatus');
var newGameButton = document.getElementById('newGame');
var userScore = document.getElementById('userScore');
var drawScore = document.getElementById('drawScore');
var computerScore = document.getElementById('computerScore');
var turn = 'X';
var winningConditions = [[0, 4, 8],
                        [2, 4, 6],
                        [0, 1, 2],
                        [3, 4, 5],
                        [0, 3, 6], 
                        [6, 7, 8],
                        [1, 4, 7],
                        [2, 5, 8]];

/* 
    Disable/enable pointer events for board
    Input: enable - true if enable pointer, false if disable pointer
    Output: None
*/
function pointerEvents(enable) {
    if (enable) {
        visualBoard.forEach((square) => {
            square.style.pointerEvents = 'auto';
        });
    } else {
        visualBoard.forEach((square) => {
            square.style.pointerEvents = 'none';
        });
    };
}

/* 
    Pop out animation 
    Input: idx - index of winning conditions in visual board
    Output: None
*/
function animation(idx) {
    visualBoard[idx].style.animation = 'none';
    setTimeout(() => {
        visualBoard[idx].style.animation = 'pop 1s linear 1';
        visualBoard[idx].style.backgroundColor = 'white';
    }, 200);
}

/* 
    Check all the 8 win conditions + draw
    Input: None
    Output: true if there's a win or draw, false if no win yet
*/
function checkWin() {
    pointerEvents(false);
    var winner, idx = null;
    winningConditions.forEach((winningCondition) => {
        if (virtualBoard[winningCondition[0]] && virtualBoard[winningCondition[0]] === virtualBoard[winningCondition[1]] && virtualBoard[winningCondition[0]] === virtualBoard[winningCondition[2]]){
            winner = virtualBoard[winningCondition[0]]
            idx = winningCondition;
        };
    });
    if (winner) {
        idx.forEach((i) => {
            animation(i);
        });
        if (winner === 'X') {
            gameStatus.innerText = 'Winner Winner Chicken Dinner!'
            userScore.innerText = parseInt(userScore.innerText) + 1
        } else if (winner === 'O') {
            gameStatus.innerText = 'Oof, Computer won. Try again!'
            computerScore.innerText = parseInt(computerScore.innerText) + 1
        }
        return true;
    } else if (!virtualBoard.includes('')) {
        gameStatus.innerText = 'Draw!'
        drawScore.innerText = parseInt(drawScore.innerText) + 1
        visualBoard.forEach((square, i) => {
            square.style.backgroundColor = 'white';
            animation(i);
        });
        return true;
    } else {
        return false;
    };
};

/* 
    Computer playing their turn
*/
function computerPlay() {
    pointerEvents(false);
    setTimeout(() => {
        randomSquare = Math.floor(Math.random() * 9);
        while (virtualBoard[randomSquare] != '') {
            randomSquare = Math.floor(Math.random() * 9);
        };
        virtualBoard[randomSquare] = turn;
        turn = 'X';
        updateVisualBoard();
        var compWin = checkWin();
        if (!compWin) {
            gameStatus.innerText = `It's your turn!`;
            pointerEvents(true);
        };
    }, 500);
};

/* 
    Record the marks user inputs and then have computer play 
*/
function play(e) {
    var id = e.target.id;
    if (virtualBoard[id] === '') {
        virtualBoard[id] = turn;
        turn = 'O';
        updateVisualBoard();
        var userWin = checkWin();
        if (!userWin) {
            gameStatus.innerText = `It's Computer's turn!`
            computerPlay();
        };
    };
};

/* 
    After updating the virtual board, update it visually 
*/
function updateVisualBoard() {
    virtualBoard.forEach((mark, i) => {
        if (mark === 'X') {
            visualBoardImages[i].src='src/bluecandy.webp';
        } else if (mark === 'O') {
            visualBoardImages[i].src = 'src/redcandy.webp';
        } else {
            visualBoardImages[i].src = '';
        }
    });
};

/*
    Choose who starts: user=true/1; computer=false/0
*/
function userStarts() {
    return randomSquare = Math.floor(Math.random() * 2);
}

/* 
    Reset virtual and visual board 
*/
function newGame(){
    virtualBoard = ['','','','','','','','',''];
    updateVisualBoard();
    visualBoard.forEach((square) => {
        square.style.pointerEvents = 'none';
        square.style.backgroundColor = '';
        square.addEventListener('click', play);
    });
    if (userStarts()) {
        turn = 'X';
        gameStatus.innerText = 'You go first!'
        pointerEvents(true);
    } else {
        turn = 'O';
        gameStatus.innerText = 'Computer goes first!'
        setTimeout(() => {
            computerPlay();
        }, 500);
    }
};

// Begin here:
newGameButton.addEventListener('click', newGame);
newGame();
