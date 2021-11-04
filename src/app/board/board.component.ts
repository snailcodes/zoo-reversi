import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
    squares!: (undefined | 'X' | 'O')[];
    xIsNext!: boolean;
    winner!: string | undefined;
    width = 8;
    height = 8;
    highlightedSqs!: number[];
    counter = { X: 2, O: 2 };
    newFlip!: number[];

    constructor() {
        this.newGame();
    }

    ngOnInit(): void {}

    newGame() {
        this.squares = Array(this.height * this.width).fill(undefined);
        this.highlightedSqs = [];
        //TODO: math this:
        this.squares[27] = 'O';
        this.squares[28] = 'X';
        this.squares[35] = 'X';
        this.squares[36] = 'O';
        this.winner = undefined;
        this.newFlip = [];
        this.xIsNext = true;
        this.highlightMoves();
    }

    get player() {
        return this.xIsNext ? 'X' : 'O';
    }

    flipperMoves(idx: number) {
        let finalFlippedAr: number[] = [];
        // calculates all possible directions to be checked with respect to each cell, then stores the math calc to reach the idx of each cell to be checked
        let checkedDirections = [
            -(this.width + 1),
            -this.width,
            -this.width - 1,
            -1,
            1,
            this.width - 1,
            this.width,
            this.width + 1,
        ];

        //
        checkedDirections.forEach((direction) => {
            //checkedIdx is the current adjacent cell being checked
            let checkedIdx = idx + direction;
            //
            let possibleFlipAr = [];

            //the cell is filled AND what's filled is not equal to the token of the curr player
            while (
                this.squares[checkedIdx] &&
                this.squares[checkedIdx] !== this.player
            ) {
                //then - push the idx of the checked cell possible to be flipped into an array
                possibleFlipAr.push(checkedIdx);
                // the checkedcell's value then becomes the value of the cell to be flipped
                checkedIdx += direction;
                console.log('idx is', idx, 'possibleFlipAr', possibleFlipAr);
            }
            if (
                this.squares[checkedIdx] === this.player &&
                possibleFlipAr.length > 0
            ) {
                finalFlippedAr = finalFlippedAr.concat(possibleFlipAr);
                console.log('idx is', idx, 'finalFlippedAr', finalFlippedAr);
            }
        });
        return finalFlippedAr;
    }

    //bug - highlights weird ones
    highlightMoves() {
        this.highlightedSqs = [];
        this.squares.forEach((square, idx) => {
            if (!square) {
                let highlightMoves = this.flipperMoves(idx);
                if (highlightMoves.length) {
                    this.highlightedSqs.push(idx);
                }
            }
        });
    }

    isNewFlip(idx: number) {
        return this.newFlip.includes(idx);
    }

    isHighlight(idx: number) {
        return this.highlightedSqs.includes(idx);
    }

    makeMove(idx: number) {
        this.newFlip = [];
        if (!this.squares[idx] && this.highlightedSqs.includes(idx)) {
            this.flipperMoves(idx).forEach((currIdx) => {
                // this.isNewFlip(currIdx);
                this.squares[currIdx] = this.player;
                this.newFlip.push(currIdx);
            });
            this.squares.splice(idx, 1, this.player);
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
        this.squares.forEach((square) => {
            if (square) {
                this.counter[square]++;
            }
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
