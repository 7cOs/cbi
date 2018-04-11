import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'action-button',
    template: require('./action-button.component.pug'),
    styles: [ require('./action-button.component.scss') ]
})

export class ActionButtonComponent {
    @Input() actionLabel: string;
    @Input() isDisabled: boolean;
    @Output() onActionButtonClicked: EventEmitter<{actionType: string}> = new EventEmitter<{actionType: string}>();

    onButtonClicked(): void {
        this.onActionButtonClicked.emit({actionType: this.actionLabel});
    }
}
