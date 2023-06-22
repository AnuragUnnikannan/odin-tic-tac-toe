// Player factory function
const Player = (name, sign) => {
    const getName = () => name;
    const getSign = () => sign;
    return {getName, getSign};
}

// Gameboard module for rendering the board
const GameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    let turn = "O";

    //Setting up grid
    const render = (mode) => {
        let content = "";
        board.forEach((cell, i) => {
            content += `<div class="cell" id="c${i}">${cell}</div>`;
        });
        document.querySelector(".gameboard").innerHTML = content;

        document.querySelectorAll(".cell").forEach((cell) => {
            cell.addEventListener("click", (e) => {
                putSign(e, mode);
            });
        });
    };
    
    //Determines which sign is to be put i.e. either "X" or "O"
    const putSign = (e, mode) => {
        if(mode === "human") {
            if(e.target.innerText === "") {
                if(turn === "X") {
                    board[e.target.id[1]] = "O";
                    e.target.innerText = "O";
                    turn = "O";
                }
                else {
                    board[e.target.id[1]] = "X";
                    e.target.innerText = "X";
                    turn = "X";
                }
                console.log(board);
                GameController.check();
            }
        }
        else {
            if(e.target.innerText === "") {
                board[e.target.id[1]] = "X";
                e.target.innerText = "X";
                let result = GameController.check();
                if(!result) {
                    putSignAuto();
                    console.log(board);
                }
            }
        }
    }

    //Puts sign automatically on behalf of computer
    const putSignAuto = () => {
        let randomIndex;
        while(true) {
            randomIndex = Math.floor((Math.random() * 10)) - 1;
            if(board[randomIndex] === "")
                break;
        }
        board[randomIndex] = "O";
        document.querySelector(`#c${randomIndex}`).innerText = "O";
        GameController.check();
    }

    //To get sign at specific position
    const getSign = (i) => board[i];

    //Checks for draw condition by counting number of blank cells
    const isDraw = () => {
        let count = 0;
        board.forEach((x) => {
            if(x === "")
                count++;
        });
        if(count === 0)
            return true;
        else
            return false;
    }

    return {render, isDraw, getSign, putSignAuto};
})();

//GameController module for taking input for names and checking for wins
const GameController = (() => {
    let playerX;
    let playerO;
    let winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    let info = document.querySelector(".info");
    let wrapper = document.querySelector(".wrapper");
    let mainContainer = document.querySelector(".main-container");

    //For playing against computer
    const vsComputer = () => {
        mainContainer.innerHTML += `
        <div class="gameboard"></div>
        `;
        GameBoard.render("computer");
        playerX = Player("Player", "X");
        playerO = Player("Computer", "O");
    }
    document.querySelector(".computer").addEventListener("click", () => {
        mainContainer.removeChild(document.querySelector(".type"));
        vsComputer();
    });

    
    //For playing against another player
    const vsHuman = () => {
        mainContainer.innerHTML += `
        <form action="">
            <input type="text" placeholder="Player X" id="plx" autocomplete="off" required>
            <input type="text" placeholder="Player O" id="plo" autocomplete="off" required>
            <button type="submit" class="start">START</button>
        </form>

        <div class="gameboard">
        </div>
        `;

        // Rendering grid only after taking input for player names
        document.querySelector(".start").addEventListener("click", (e) => {
            e.preventDefault();
            let xName = document.querySelector("#plx").value;
            let oName = document.querySelector("#plo").value;
            if(xName && oName) {
                mainContainer.removeChild(document.querySelector("form"));
                GameBoard.render("human");
                playerX = Player(xName, "X");
                playerO = Player(oName, "O");
            }
        });
    }
    document.querySelector(".human").addEventListener("click", () => {
        mainContainer.removeChild(document.querySelector(".type"));
        vsHuman();
    }); 
    
    // To check for win/draw condition and display result
    const check = () => {
        for(combination of winningCombinations) {
            if(GameBoard.getSign(combination[0]) === GameBoard.getSign(combination[1]) && GameBoard.getSign(combination[1]) === GameBoard.getSign(combination[2]) && GameBoard.getSign(combination[2]) !== "") {
                let sign = GameBoard.getSign(combination[0]);
                if(sign === "X")
                    info.textContent = `${playerX.getName()} wins!`;
                else
                    info.textContent = `${playerO.getName()} wins!`;

                wrapper.style.display = "flex";
                return true;
            }
        }
        if(GameBoard.isDraw()) {
            info.textContent = `Draw`;
            wrapper.style.display = "flex";
            return true;
        }
        else
            return false;
    };

    return {check};
    
})();