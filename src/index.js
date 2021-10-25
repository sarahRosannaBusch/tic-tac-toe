// Tic Tac Toe game based on React tutorial: https://reactjs.org/tutorial/tutorial.html
// date: 20 October 2021
// by Sarah Rosanna Busch

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { findBestMove } from './minimax-AI.js';
import { isMovesLeft } from './minimax-AI.js';
import xImg from "./img/X.png";
import oImg from "./img/O.png";
import emptyImg from "./img/empty.png";

function Square(props) {
    let imgSrc = emptyImg;
    if(props.value === "X") {
        imgSrc = xImg;
    } else if(props.value === "O") {
        imgSrc = oImg;
    }

    return (
        <button className="square" onClick={props.onClick}>
            <img src={imgSrc} alt={props.value} />
        </button>
    )
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            clicksDisabled: false
        };
    }

    componentDidMount() {
        this.timout = null;
    }

    componentWillUnmount() {    //runs when Board is removed from DOM    
        clearTimeout(this.timout);
        this.timout = null;
    }

    handleClick(i) {
        const squares = this.state.squares.slice();

        if(this.state.clicksDisabled || squares[i] || calculateWinner(squares)) {
            return;
        } 

        if(this.state.xIsNext) { //bc it hasn't been swapped yet
            this.setState({clicksDisabled:true});
            this.timout = setTimeout(() => this.aiTurn(), 750, this);
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext
        });
    }    

    aiTurn() { 
        const squares = this.state.squares.slice();
        const board = squaresToBoard(squares);
        let oMove = findBestMove(board); //{row: , col: }
        if(oMove === undefined) {
            console.log("oMove = " + JSON.stringify(oMove));
        }
        let i = oMove.col;
        if(oMove.row === 1) {
            i +=3;
        } else if(oMove.row === 2) {
            i += 6;
        }
        this.setState({clicksDisabled: false});
        this.handleClick(i);
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status = '';
        if (winner) {
            switch(winner) {
                case 'X': status = "You win!"; break;
                case 'O': status = "You lose!"; break;
                case 'T': status = "Tie!"; break;
                default: console.log("wtf? " + JSON.stringify(winner)); break;
            }
        } else {
            if(this.state.xIsNext) {
                status = "Your turn.";
            } else {
                status = ". . ."
            }
        }

        let statusClass = winner ? "gameOver" : "status";

        return (
            <div className="game">
                <div className="title"><h1>Tic Tac Toe</h1></div>
                <div className="board">
                    <div className="board-row">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>
                <div className={statusClass}><br/>{status}</div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div>
                <Board />
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <React.StrictMode>
        <Game />
    </React.StrictMode>,
    document.getElementById('root')
);

// ========================================

function squaresToBoard(squares) {
    const b = squares.map(function(value, index, array) {
        return value === null ? '_' : value;
    });
    const board = [b.slice(0,3), b.slice(3, 6), b.slice(6,9)];
    return board;
}

function calculateWinner(squares) {
    let winner = null;
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winner = squares[a];
        }
    }

    let board = squaresToBoard(squares);
    if(!winner && !isMovesLeft(board)) {
        winner = 'T'; //it's a tie
    }

    return winner;
}
