// Tic Tac Toe game based on React tutorial: https://reactjs.org/tutorial/tutorial.html
// date: 20 October 2021
// by Sarah Rosanna Busch

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { findBestMove } from './minimax-AI.js';
import { isMovesLeft } from './minimax-AI.js';

var timer = null;

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
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

    handleClick(i) {
        const squares = this.state.squares.slice();

        if(this.state.clicksDisabled || squares[i] || calculateWinner(squares)) {
            return;
        } 

        if(this.state.xIsNext) { //bc it hasn't been swapped yet
            this.setState({clicksDisabled:true});
            timer = setTimeout(aiTurn, 750, this);
        }

        function aiTurn(that) { 
            const squares = that.state.squares.slice();
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
            that.setState({clicksDisabled: false});
            that.handleClick(i);
            clearTimeout(timer);
            timer = null;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext
        });
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
                case 'X': status = "You won!"; break;
                case 'O': status = "You lost!"; break;
                case 'T': status = "You tied."; break;
                default: console.log("wtf? " + JSON.stringify(winner)); break;
            }
        } else {
            if(this.state.xIsNext) {
                status = "Your turn.";
            } else {
                status = "AI-Bot is thinking..."
            }
        }

        return (
            <div>
                <div className="status">{status}</div>
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
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
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
