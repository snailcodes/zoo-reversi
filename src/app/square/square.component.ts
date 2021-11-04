import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-square',
    templateUrl: './square.component.html',
    styleUrls: ['./square.component.scss'],
})
export class SquareComponent {
    @Input() value: 'X' | 'O' | undefined;
    @Input() player: 'X' | 'O';
    // @Input('isHighlight') isHighlight: boolean = false;
    @Input() isHighlight: boolean = true;

    constructor() {
        this.player = 'X';
    }
}
