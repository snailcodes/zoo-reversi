import { Component, OnInit } from '@angular/core';

type locations = [number, number][];

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
    squares!: ('X' | 'O' | undefined)[][];

    xIsNext!: boolean;
    winner!: string | undefined;
    width = 8;
    height = 8;
    highlightedSqs!: locations;
    counter = { X: 2, O: 2 };
    newFlip!: locations;

    constructor() {
        this.newGame();
    }

    ngOnInit(): void {}

    newGame() {
        // this.squares = Array(this.height * this.width).fill(undefined);
        this.squares = [];
        for (let row = 0; row < this.height; row++) {
            this.squares.push([]);
            for (let col = 0; col < this.width; col++) {
                this.squares[row][col] = undefined;
            }
        }

        this.highlightedSqs = [];
        //TODO: math this:

        this.squares[this.height / 2 - 1][this.width / 2 - 1] = 'O';
        this.squares[this.height / 2 - 1][this.width / 2] = 'X';
        this.squares[this.height / 2][this.width / 2] = 'O';
        this.squares[this.height / 2][this.width / 2 - 1] = 'X';

        this.winner = undefined;
        this.newFlip = [];
        this.xIsNext = true;
        this.highlightMoves();
    }

    get player() {
        return this.xIsNext ? 'X' : 'O';
    }

    flipperMoves(row: number, col: number) {
        let finalFlippedAr: locations = [];
        // calculates all possible directions to be checked with respect to each cell, then stores the math calc to reach the idx of each cell to be checked
        let checkedDirections = [
            {
                row: -1,
                col: -1,
            },
            {
                row: -1,
                col: 0,
            },
            {
                row: -1,
                col: 1,
            },
            {
                row: 0,
                col: -1,
            },
            {
                row: 0,
                col: 1,
            },
            {
                row: 1,
                col: -1,
            },
            {
                row: 1,
                col: 0,
            },
            {
                row: 1,
                col: 1,
            },
        ];

        checkedDirections.forEach((direction) => {
            //checkedIdx is the current adjacent cell being checked
            let checkedRow = row + direction.row;
            let checkedCol = col + direction.col;

            let possibleFlipAr: [number, number][] = [];

            //the cell is filled AND what's filled is not equal to the token of the curr player
            while (
                this.squares[checkedRow] &&
                this.squares[checkedRow][checkedCol] &&
                this.squares[checkedRow][checkedCol] !== this.player
            ) {
                possibleFlipAr.push([checkedRow, checkedCol]);
                // the checkedcell's value then becomes the value of the cell to be flipped
                checkedRow += direction.row;
                checkedCol += direction.col;
            }
            if (
                this.squares[checkedRow] &&
                this.squares[checkedRow][checkedCol] === this.player &&
                possibleFlipAr.length > 0
            ) {
                finalFlippedAr = finalFlippedAr.concat(possibleFlipAr);
            }
        });
        return finalFlippedAr;
    }

    //bug - highlights weird ones
    highlightMoves() {
        this.highlightedSqs = [];
        this.squares.forEach((cells, row) => {
            cells.forEach((square, col) => {
                if (!square) {
                    let highlightMoves = this.flipperMoves(row, col);
                    if (highlightMoves.length) {
                        this.highlightedSqs.push([row, col]);
                    }
                }
            });
        });
    }

    isNewFlip(row: number, col: number) {
        return checkArray(this.newFlip, row, col);
    }

    isHighlight(row: number, col: number) {
        return checkArray(this.highlightedSqs, row, col);
    }

    makeMove(row: number, col: number) {
        this.newFlip = [];
        if (!this.squares[row][col] && this.isHighlight(row, col)) {
            this.flipperMoves(row, col).forEach((location) => {
                this.squares[location[0]][location[1]] = this.player;
                this.newFlip.push(location);
            });
            // this.squares.splice(idx, 1, this.player);
            this.squares[row][col] = this.player;
            this.xIsNext = !this.xIsNext;
            this.highlightMoves();
        }
        this.winner = this.calcWinner();
    }

    isXwinner() {
        let result;
        console.log(this.winner);
        result = this.winner === 'X' ? true : false;
        console.log(result);
        return result;
    }

    calcWinner() {
        this.counter = { X: 0, O: 0 };
        this.squares.forEach((cells) => {
            cells.forEach((square) => {
                if (square) {
                    this.counter[square]++;
                }
            });
        });

        console.log('counter is', this.counter);

        //Method A of winning - turning all board to one symbol
        if (this.counter.X === 0) {
            return 'O';
        }

        if (this.counter.O === 0) {
            return 'X';
        }

        //Method B of winning - filling all of the board
        if (
            this.counter.X + this.counter.O === this.width * this.height ||
            this.highlightedSqs.length === 0
        ) {
            if (this.counter.X === this.counter.O) return 'Match';

            return this.counter.X > this.counter.O ? 'X' : 'O';
        }

        return undefined;
    }
}

function checkArray(checkedArr: locations, row: number, col: number) {
    return checkedArr.some((squareIdx) => {
        return squareIdx[0] === row && squareIdx[1] === col;
    });
}
